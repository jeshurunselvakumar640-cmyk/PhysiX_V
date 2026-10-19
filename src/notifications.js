/**
 * PhysiX — Streak Reminder Push Notification Service
 * 
 * Integrates Firebase Cloud Messaging (FCM) using the existing Firebase App
 * and reuses the existing root Service Worker registration (/sw.js).
 * 
 * Strict Architectural Safeguards:
 * - Never prompts for notification permission on initial page load.
 * - Obtains tokens only upon explicit user opt-in via enableStreakReminders().
 * - Reuses existing service worker from offline-manager.js without registering a second SW.
 * - Stores device registration tokens strictly under the authenticated user's document users/{uid}.
 * - Rejects guest / signed-out users from saving push tokens.
 * - Fails gracefully if FCM is unsupported, offline, or if VAPID key is unconfigured.
 */

import { app, auth, db, doc, getDoc, setDoc, arrayUnion, arrayRemove } from "./firebase.js";
import { getServiceWorkerRegistration } from "./offline-manager.js";
import { isCloudOperationAllowed } from "./user-data-service.js";

// Configurable VAPID Public Key (overridable via VITE_FIREBASE_VAPID_KEY in .env / Vercel)
// Note: This is a Web Push public certificate key, NOT a private secret.
// For production push reception, this key MUST match the Key Pair generated in the Firebase Console:
// Project Settings -> Cloud Messaging -> Web Configuration -> Web Push certificates.
const DEFAULT_VAPID_KEY = "BCbkY_EflDlf1K-62yyBcF_2UCN90k9Xb3M1ghdqThNzlQvF3TQcrNFyqZXmWZ8-bGFYHfNcx22eLDzIn_fIrjU";

export function getVapidKey() {
  let key = "";
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_FIREBASE_VAPID_KEY) {
    key = String(import.meta.env.VITE_FIREBASE_VAPID_KEY).trim();
  } else {
    key = DEFAULT_VAPID_KEY.trim();
  }
  // Strip surrounding quotes if wrapped in .env or deployment configuration
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  return key;
}

/**
 * Safely sanitize and validate a notification target URL.
 * Strictly restricts navigation to same-origin paths and approved PhysiX relative paths.
 * Blocks any external domain, javascript:, data:, or malformed protocols.
 */
export function sanitizeNotificationUrl(rawUrl, baseOrigin) {
  if (!rawUrl || typeof rawUrl !== "string") {
    return "/";
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) return "/";

  // Prevent dangerous protocol schemes
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return "/";
  }

  try {
    const origin = baseOrigin || (typeof window !== "undefined" ? window.location.origin : "https://physix.local");
    const resolved = new URL(trimmed, origin);

    // Enforce strictly same-origin
    if (resolved.origin !== origin) {
      return "/";
    }

    return resolved.pathname + resolved.search + resolved.hash;
  } catch (e) {
    return "/";
  }
}

/**
 * Pure helper to compute multi-device registration preference transitions.
 * 
 * Multi-Device Preference Model:
 * - Each device maintains its own FCM registration token.
 * - When a device opts out, ONLY that device's token is removed from fcmTokens.
 * - streakRemindersEnabled remains TRUE if other valid device tokens exist.
 * - streakRemindersEnabled is set to FALSE ONLY when all device registrations have been removed,
 *   or when the user explicitly requests opt-out across all devices (allDevices: true).
 * 
 * Schema Limitation Note:
 * A flat string array fcmTokens cannot detect when a browser is uninstalled or storage cleared
 * on another device without explicit opt-out. Thus, remaining registrations reflect the recorded
 * registrations; dead tokens must be pruned by the scheduled backend upon receiving FCM delivery errors
 * (e.g. messaging/registration-token-not-registered).
 */
export function calculateUpdatedPreferences(existingUserData, tokenToRemove, options = {}) {
  const { allDevices = false } = options;
  const currentTokens = Array.isArray(existingUserData?.fcmTokens)
    ? existingUserData.fcmTokens.filter((t) => typeof t === "string" && t.trim().length > 0)
    : [];

  const remainingTokens = tokenToRemove
    ? currentTokens.filter((t) => t !== tokenToRemove)
    : currentTokens;

  if (allDevices || remainingTokens.length === 0) {
    return {
      streakRemindersEnabled: false,
      remainingTokens: allDevices ? [] : remainingTokens,
      shouldClearTokens: allDevices
    };
  }

  return {
    streakRemindersEnabled: true,
    remainingTokens,
    shouldClearTokens: false
  };
}

// Module singleton state
let messagingInstance = null;
let foregroundUnsubscribe = null;
let enableStreakRemindersInFlight = null;

/**
 * Check if Web Push, Service Worker, and FCM are supported in current browser environment.
 * Fails gracefully without throwing in Node, SSR, or unsupported mobile browsers.
 */
export async function isPushNotificationSupported() {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;
  if (!("serviceWorker" in navigator)) return false;
  if (!("PushManager" in window)) return false;

  try {
    const { isSupported } = await import("firebase/messaging");
    return await isSupported();
  } catch (err) {
    console.warn("[Notifications] Push messaging capability check failed:", err);
    return false;
  }
}

/**
 * Handle foreground messages delivered while the PhysiX tab is actively open.
 * Dispatches an event and shows an in-app toast to avoid duplicate system notifications.
 */
function handleForegroundMessage(payload) {
  if (!payload) return;
  const data = payload.data || {};
  const notification = payload.notification || {};
  const title = (typeof data.title === "string" && data.title.trim()) || notification.title || "PhysiX Streak Reminder";
  const body = (typeof data.body === "string" && data.body.trim()) || notification.body || "Maintain your learning momentum! Complete an experiment today.";
  const rawUrl = data.url || notification.click_action || "/";
  const url = sanitizeNotificationUrl(rawUrl);

  // Dispatch custom DOM event for UI integration
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("physix-foreground-notification", {
        detail: { title, body, url, payload }
      })
    );

    // If global showToast helper is active, present a non-intrusive toast
    if (typeof window.showToast === "function") {
      window.showToast(`🔥 ${title}: ${body}`);
    }
  }
}

/**
 * Lazy-initialize Firebase Messaging instance using the existing Firebase App
 */
export async function getMessagingInstance() {
  if (messagingInstance) return messagingInstance;
  const supported = await isPushNotificationSupported();
  if (!supported) return null;

  try {
    const { getMessaging, onMessage } = await import("firebase/messaging");
    messagingInstance = getMessaging(app);

    // Register foreground message listener once
    if (!foregroundUnsubscribe && typeof window !== "undefined") {
      foregroundUnsubscribe = onMessage(messagingInstance, (payload) => {
        handleForegroundMessage(payload);
      });
    }

    return messagingInstance;
  } catch (err) {
    console.warn("[Notifications] Could not initialize Firebase Messaging:", err);
    return null;
  }
}

/**
 * Explicit user opt-in: Enables streak reminder notifications.
 * Requests browser permission ONLY when triggered by explicit user action.
 * Concurrency-safe: shares an in-flight promise across duplicate rapid triggers.
 */
export async function enableStreakReminders() {
  if (enableStreakRemindersInFlight) {
    return enableStreakRemindersInFlight;
  }

  enableStreakRemindersInFlight = (async () => {
    // 1. Capability Check
    const supported = await isPushNotificationSupported();
    if (!supported) {
      return {
        success: false,
        reason: "unsupported",
        error: "Web push notifications are not supported by this browser."
      };
    }

    // 2. Offline Guard
    if (!navigator.onLine || !isCloudOperationAllowed()) {
      return {
        success: false,
        reason: "offline",
        error: "Cannot configure push notifications while offline."
      };
    }

    // 3. Authentication Check — strictly reject guests / signed-out clients
    const currentUser = auth?.currentUser;
    if (!currentUser || !currentUser.uid || currentUser.uid === "guest") {
      return {
        success: false,
        reason: "unauthenticated",
        error: "You must be signed in with a PhysiX account to enable daily streak push reminders."
      };
    }

    // 4. Request Browser Notification Permission
    let permission = Notification.permission;
    if (permission !== "granted") {
      try {
        permission = await Notification.requestPermission();
      } catch (e) {
        // Safari callback fallback
        permission = await new Promise((resolve) => {
          Notification.requestPermission(resolve);
        });
      }
    }

    if (permission !== "granted") {
      return {
        success: false,
        reason: "permission_denied",
        error: "Notification permission was not granted by the user."
      };
    }

    // 5. Validate VAPID Key
    const vapidKey = getVapidKey();
    if (!vapidKey || typeof vapidKey !== "string" || vapidKey.trim() === "") {
      return {
        success: false,
        reason: "missing_vapid_key",
        error: "VAPID public key is missing or not configured."
      };
    }

    // 6. Reuse existing Service Worker Registration from offline-manager.js
    const swReg = await getServiceWorkerRegistration();
    if (!swReg) {
      return {
        success: false,
        reason: "sw_unavailable",
        error: "Active service worker registration is not available."
      };
    }

    // 7. Obtain FCM Registration Token
    try {
      const messaging = await getMessagingInstance();
      if (!messaging) {
        return {
          success: false,
          reason: "messaging_init_failed",
          error: "Firebase Messaging could not be initialized."
        };
      }

      const { getToken } = await import("firebase/messaging");
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: swReg
      });

      if (!token) {
        return {
          success: false,
          reason: "no_token",
          error: "Failed to generate FCM registration token."
        };
      }

      // 8. Store token in Firestore strictly under users/{currentUser.uid}
      if (db) {
        const userRef = doc(db, "users", currentUser.uid);
        const now = new Date().toISOString();
        await setDoc(
          userRef,
          {
            fcmTokens: arrayUnion(token),
            lastFcmToken: token,
            streakRemindersEnabled: true,
            fcmTokenUpdatedAt: now,
            updatedAt: now
          },
          { merge: true }
        );
      }

      // Record locally for fast state checks
      try {
        localStorage.setItem(`physix_fcm_token_${currentUser.uid}`, token);
        localStorage.setItem("physix_streak_reminders_enabled", "true");
      } catch (_) {}

      return {
        success: true,
        token,
        permission
      };
    } catch (err) {
      console.error("[Notifications] Token generation error:", err);
      const msg = err?.message || "";
      let reason = "token_error";
      let safeError = msg || "Failed to obtain push notification token.";

      if (err?.name === "AbortError" || msg.includes("push service error")) {
        reason = "push_service_error";
        safeError = "Registration failed - push service error. The browser push service rejected the subscription request. Ensure Google Push Services are enabled in browser settings (especially in Brave), your service worker has active push handlers, and the VAPID key matches Firebase Cloud Messaging.";
      } else if (err?.name === "NotAllowedError" || msg.includes("permission denied")) {
        reason = "permission_denied";
        safeError = "Notification permission was not granted by the user.";
      } else if (err?.code === "messaging/invalid-vapid-key" || msg.includes("vapid")) {
        reason = "invalid_vapid_key";
        safeError = "The configured VAPID public key format is invalid.";
      }

      return {
        success: false,
        reason,
        error: safeError
      };
    }
  })();

  try {
    return await enableStreakRemindersInFlight;
  } finally {
    enableStreakRemindersInFlight = null;
  }
}

/**
 * Explicit user opt-out: Disables streak reminders on the current device (or all devices if specified).
 * 
 * Multi-device behavior:
 * - Removes ONLY the current device's token from Firestore `fcmTokens`.
 * - If other devices remain registered for the user, `streakRemindersEnabled` remains `true`.
 * - If 0 devices remain (or options.allDevices is true), `streakRemindersEnabled` is set to `false`.
 */
export async function disableStreakReminders(options = {}) {
  const { allDevices = false } = options;
  const currentUser = auth?.currentUser;
  if (!currentUser || !currentUser.uid || currentUser.uid === "guest") {
    return {
      success: false,
      reason: "unauthenticated",
      error: "You must be signed in to modify notification preferences."
    };
  }

  try {
    const cachedToken = (typeof localStorage !== "undefined")
      ? localStorage.getItem(`physix_fcm_token_${currentUser.uid}`)
      : null;

    // Update Firestore if online
    if (db && navigator.onLine && isCloudOperationAllowed()) {
      const userRef = doc(db, "users", currentUser.uid);
      const now = new Date().toISOString();
      const updates = {
        fcmTokenUpdatedAt: now,
        updatedAt: now
      };

      if (cachedToken) {
        updates.fcmTokens = arrayRemove(cachedToken);
      }

      // Check remaining device registrations before modifying global flag
      try {
        const snap = await getDoc(userRef);
        const userData = (snap && snap.exists()) ? snap.data() : {};
        const prefResult = calculateUpdatedPreferences(userData, cachedToken, { allDevices });

        updates.streakRemindersEnabled = prefResult.streakRemindersEnabled;
        if (prefResult.shouldClearTokens) {
          updates.fcmTokens = [];
        }
      } catch (readErr) {
        console.warn("[Notifications] Could not read user document to check remaining tokens:", readErr);
        // Fallback: only remove current token, do not globally disable streak reminders
      }

      await setDoc(userRef, updates, { merge: true });
    }

    // Revoke token on FCM client
    try {
      const messaging = await getMessagingInstance();
      if (messaging) {
        const { deleteToken } = await import("firebase/messaging");
        await deleteToken(messaging);
      }
    } catch (e) {
      console.warn("[Notifications] Non-fatal client deleteToken error:", e);
    }

    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(`physix_fcm_token_${currentUser.uid}`);
        localStorage.setItem("physix_streak_reminders_enabled", "false");
      }
    } catch (_) {}

    return { success: true };
  } catch (err) {
    console.error("[Notifications] Error disabling streak reminders:", err);
    return {
      success: false,
      error: err.message || "Failed to disable streak reminders."
    };
  }
}

/**
 * Inspect current notification permission, support, and opt-in status.
 */
export async function getStreakReminderStatus() {
  const supported = await isPushNotificationSupported();
  const permission = (typeof window !== "undefined" && "Notification" in window)
    ? Notification.permission
    : "unsupported";

  const currentUser = auth?.currentUser;
  const isAuth = Boolean(currentUser && currentUser.uid && currentUser.uid !== "guest");
  const localEnabled = typeof localStorage !== "undefined" && localStorage.getItem("physix_streak_reminders_enabled") === "true";
  const cachedToken = (isAuth && typeof localStorage !== "undefined")
    ? localStorage.getItem(`physix_fcm_token_${currentUser.uid}`)
    : null;

  return {
    supported,
    permission,
    authenticated: isAuth,
    deviceEnabled: Boolean(supported && permission === "granted" && localEnabled && cachedToken),
    enabled: Boolean(supported && permission === "granted" && localEnabled && cachedToken),
    token: cachedToken
  };
}

// Global attachment for manual verification, console testing, and subsequent stage UI binding
if (typeof window !== "undefined") {
  window.PhysiXNotifications = {
    isPushNotificationSupported,
    enableStreakReminders,
    disableStreakReminders,
    getStreakReminderStatus,
    getVapidKey,
    sanitizeNotificationUrl,
    calculateUpdatedPreferences
  };
}

export default {
  isPushNotificationSupported,
  enableStreakReminders,
  disableStreakReminders,
  getStreakReminderStatus,
  getVapidKey,
  sanitizeNotificationUrl,
  calculateUpdatedPreferences
};

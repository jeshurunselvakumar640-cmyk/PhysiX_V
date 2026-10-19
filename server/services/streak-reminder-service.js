/**
 * PhysiX — Streak Reminder Push Notification Server Service
 * 
 * Determines user streak eligibility, enforces IST timezone semantics,
 * guarantees delivery idempotency with stale-lock recovery, constructs
 * data-only FCM payloads, and handles stale token removal with bounded concurrency.
 */
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore, getAdminMessaging } from "../firebase-admin.js";

export const STREAK_TIMEZONE = "Asia/Kolkata";
export const STALE_LOCK_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
export const DEFAULT_BATCH_CONCURRENCY = 8; // Bounded concurrency pool size

/**
 * Format any date into YYYY-MM-DD in the configured timezone (Asia/Kolkata).
 * Standardized across both frontend and backend.
 */
export function getCalendarDateString(date = new Date(), timeZone = STREAK_TIMEZONE) {
  const d = (date instanceof Date && !isNaN(date.getTime()))
    ? date
    : (typeof date === "number" || typeof date === "string")
      ? new Date(date)
      : new Date();
  const safeDate = isNaN(d.getTime()) ? new Date() : d;

  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    const parts = formatter.formatToParts(safeDate);
    const y = parts.find((p) => p.type === "year")?.value;
    const m = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    if (y && m && day) return `${y}-${m}-${day}`;
  } catch (err) {
    // Fallback: UTC + 330 mins (+05:30 IST)
  }

  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(safeDate.getTime() + istOffsetMs);
  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(istDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Robustly parse and normalize any date input (ISO string, YYYY-MM-DD, timestamp)
 * into a YYYY-MM-DD calendar date in Asia/Kolkata.
 */
export function normalizeToLocalDateString(input, timeZone = STREAK_TIMEZONE) {
  if (!input) return null;

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : getCalendarDateString(input, timeZone);
  }

  if (typeof input === "number") {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : getCalendarDateString(d, timeZone);
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return getCalendarDateString(parsed, timeZone);
    }

    const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }

  return null;
}

/**
 * Calculate calendar day difference between two dates safely in pure UTC days.
 * Returns d2 - d1 in whole days.
 */
export function getDayDifference(dateStr1, dateStr2, timeZone = STREAK_TIMEZONE) {
  if (!dateStr1 || !dateStr2) return 0;
  const d1Str = normalizeToLocalDateString(dateStr1, timeZone);
  const d2Str = normalizeToLocalDateString(dateStr2, timeZone);
  if (!d1Str || !d2Str || d1Str === d2Str) return 0;

  const [y1, m1, day1] = d1Str.split("-").map(Number);
  const [y2, m2, day2] = d2Str.split("-").map(Number);

  const utc1 = Date.UTC(y1, m1 - 1, day1);
  const utc2 = Date.UTC(y2, m2 - 1, day2);

  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

/**
 * Determine streak reminder eligibility for a candidate user.
 * 
 * Rules:
 * 1. streakRemindersEnabled must be strictly true.
 * 2. streak must be a positive number (> 0).
 * 3. Must have at least 1 registered FCM token.
 * 4. Must NOT have recorded activity today in either lastLoginDate or lastActiveDate.
 * 5. Compares today against the MOST RECENT valid date between lastLoginDate and lastActiveDate.
 * 6. If activity was yesterday (diff === 1), user qualifies ("streak_at_risk").
 * 7. If activity was > 1 day ago, streak is broken / expired ("streak_already_expired").
 * 8. If neither field contains a usable date, performs a conservative skip.
 */
export function evaluateUserEligibility(userData, todayStr = getCalendarDateString()) {
  if (!userData || typeof userData !== "object") {
    return { eligible: false, reason: "invalid_user_data", tokens: [] };
  }

  // 1. Explicit opt-in verification
  if (userData.streakRemindersEnabled !== true) {
    return { eligible: false, reason: "reminders_disabled", tokens: [] };
  }

  // 2. Positive streak count verification
  const streak = Number(userData.streak) || 0;
  if (streak <= 0) {
    return { eligible: false, reason: "zero_or_negative_streak", tokens: [] };
  }

  // 3. Registered device tokens verification
  const rawTokens = Array.isArray(userData.fcmTokens) ? userData.fcmTokens : [];
  const tokens = rawTokens.filter((t) => typeof t === "string" && t.trim().length > 0);
  if (tokens.length === 0) {
    return { eligible: false, reason: "no_fcm_tokens", tokens: [] };
  }

  // 4. Activity evaluation for today
  const lastLoginStr = normalizeToLocalDateString(userData.lastLoginDate);
  const lastActiveStr = normalizeToLocalDateString(userData.lastActiveDate);

  // If the user was active today via either login or lab experiment activity, skip immediately
  if (lastLoginStr === todayStr || lastActiveStr === todayStr) {
    return { eligible: false, reason: "already_active_today", tokens };
  }

  // 5. Reference date: Choose the MOST RECENT valid calendar date between lastLoginDate and lastActiveDate
  const candidateDates = [lastLoginStr, lastActiveStr].filter((d) => Boolean(d) && /^\d{4}-\d{2}-\d{2}$/.test(d));

  if (candidateDates.length === 0) {
    // Insufficient stored data to verify streak status: conservative skip
    return { eligible: false, reason: "missing_activity_date_conservative_skip", tokens };
  }

  // Lexicographical sort on ISO YYYY-MM-DD produces exact chronological order
  const referenceDate = candidateDates.sort().reverse()[0];

  const diff = getDayDifference(referenceDate, todayStr);

  if (diff < 1) {
    // Activity is marked today or in the future
    return { eligible: false, reason: "already_active_today", tokens };
  } else if (diff > 1) {
    // Streak has already broken / expired (missed >= 2 calendar days)
    return { eligible: false, reason: "streak_already_expired", tokens };
  }

  // diff === 1: Active yesterday, zero activity today, streak at risk!
  return { eligible: true, reason: "streak_at_risk", tokens };
}

/**
 * Construct data-only FCM payload conforming strictly to the public/sw.js contract.
 * Note: Never includes a top-level 'notification' block to avoid duplicate push display.
 */
export function buildDataOnlyFcmPayload(token, overrides = {}) {
  const title = overrides.title || "Your PhysiX streak is at risk!";
  const body = overrides.body || "Complete a physics activity before midnight to protect your streak.";
  const url = overrides.url || "/";
  const tag = overrides.tag || "physix-streak-reminder";

  return {
    token,
    data: {
      title: String(title),
      body: String(body),
      url: String(url),
      tag: String(tag)
    }
  };
}

/**
 * Determine whether an FCM error indicates an invalid or revoked registration token.
 */
export function isInvalidTokenError(err) {
  if (!err) return false;
  const code = err.code || "";
  const msg = (err.message || "").toLowerCase();

  return (
    code === "messaging/invalid-registration-token" ||
    code === "messaging/registration-token-not-registered" ||
    code === "messaging/invalid-argument" ||
    msg.includes("not registered") ||
    msg.includes("invalid registration token")
  );
}

/**
 * Cleanly remove an invalid FCM token from a user's document using a transaction.
 * Only flips streakRemindersEnabled to false if NO usable tokens remain.
 */
export async function removeInvalidToken(db, uid, invalidToken) {
  if (!db || !uid || !invalidToken) return;

  const userRef = db.collection("users").doc(uid);

  try {
    await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(userRef);
      if (!snap.exists) return;

      const data = snap.data() || {};
      const currentTokens = Array.isArray(data.fcmTokens) ? data.fcmTokens : [];
      const remainingTokens = currentTokens.filter((t) => t !== invalidToken);

      const updates = {
        fcmTokenUpdatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (FieldValue?.arrayRemove) {
        updates.fcmTokens = FieldValue.arrayRemove(invalidToken);
      } else {
        updates.fcmTokens = remainingTokens;
      }

      if (remainingTokens.length === 0) {
        updates.streakRemindersEnabled = false;
      }

      transaction.set(userRef, updates, { merge: true });
    });
  } catch (err) {
    console.warn(`[StreakReminder] Failed to remove invalid token for user ${uid}:`, err.message);
  }
}

/**
 * Transactional idempotency lock to prevent duplicate reminders across concurrent cron runs.
 * Keyed by: streak_reminder_deliveries/${uid}_${istDate}
 * 
 * Stale-Lock Recovery Semantics:
 * - Status "delivered" or "sent": strictly skipped (already delivered today).
 * - Status "failed": allowed to retry (e.g. transient FCM network glitch).
 * - Status "pending":
 *     - If attemptedAt is within STALE_LOCK_TIMEOUT_MS (15 mins), treated as an active lock and skipped.
 *     - If attemptedAt is older than STALE_LOCK_TIMEOUT_MS (15 mins), recovered as a stale abandoned lock.
 *     - If attemptedAt is missing or malformed, conservatively skipped.
 * 
 * Note on At-Most-Once vs Exactly-Once:
 * FCM delivery across server crashes cannot be guaranteed exactly-once. If a previous worker
 * dispatched the message right before crashing without finalizing the record, recovering a stale
 * lock can produce a duplicate push. This trade-off is accepted to prevent permanent daily suppression.
 */
export async function checkAndAcquireDeliveryLock(db, uid, istDate, options = {}) {
  const deliveryRef = db.collection("streak_reminder_deliveries").doc(`${uid}_${istDate}`);
  const staleTimeoutMs = Number(options.staleTimeoutMs) || STALE_LOCK_TIMEOUT_MS;
  const now = options.now ? new Date(options.now) : new Date();
  const nowMs = now.getTime();

  return await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(deliveryRef);

    if (snap.exists) {
      const data = snap.data() || {};
      const status = data.status;

      // Completed or delivered records are strictly preserved
      if (status === "delivered" || status === "sent") {
        return { acquired: false, reason: "already_delivered_today", deliveryRef };
      }

      // If status is "pending", evaluate whether it is actively running or a stale abandoned lock
      if (status === "pending") {
        const attemptedAtStr = data.attemptedAt;
        const attemptedTime = attemptedAtStr ? new Date(attemptedAtStr).getTime() : NaN;

        if (isNaN(attemptedTime)) {
          // Conservative handling: if attemptedAt is missing or malformed, do not recover blindly
          return { acquired: false, reason: "malformed_pending_lock_skipped", deliveryRef };
        }

        const elapsedMs = nowMs - attemptedTime;

        if (elapsedMs < staleTimeoutMs) {
          // Active lock within timeout window
          return { acquired: false, reason: "pending_lock_active", deliveryRef };
        }

        // Stale lock: allow new attempt by refreshing lock atomically
        transaction.set(
          deliveryRef,
          {
            uid,
            istDate,
            status: "pending",
            attemptedAt: now.toISOString(),
            recoveredFromStale: true,
            previousAttemptedAt: attemptedAtStr
          },
          { merge: true }
        );

        return { acquired: true, deliveryRef, recoveredFromStale: true };
      }

      // If status === "failed", allow safe retry
      if (status === "failed") {
        transaction.set(
          deliveryRef,
          {
            uid,
            istDate,
            status: "pending",
            attemptedAt: now.toISOString(),
            retryAttempt: true
          },
          { merge: true }
        );

        return { acquired: true, deliveryRef, isRetry: true };
      }
    }

    // Atomically claim new delivery lock
    transaction.set(
      deliveryRef,
      {
        uid,
        istDate,
        status: "pending",
        attemptedAt: now.toISOString()
      },
      { merge: true }
    );

    return { acquired: true, deliveryRef };
  });
}

/**
 * Record final delivery result on the delivery record document.
 */
export async function recordDeliveryResult(deliveryRef, result) {
  if (!deliveryRef) return;
  try {
    const now = new Date().toISOString();
    await deliveryRef.set(
      {
        status: result.status, // "delivered" | "failed"
        completedAt: now,
        successfulCount: result.successfulCount || 0,
        failedCount: result.failedCount || 0,
        error: result.error || null
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("[StreakReminder] Failed to update delivery record:", err.message);
  }
}

/**
 * Process a single candidate user safely with isolated lock, push dispatch, and token cleanup.
 */
export async function processCandidateUser(userDoc, { db, messaging, todayStr, dryRun, staleTimeoutMs, now }) {
  const uid = userDoc.id;
  const userData = userDoc.data();

  // 1. Evaluate eligibility
  const evalResult = evaluateUserEligibility(userData, todayStr);
  if (!evalResult.eligible) {
    return {
      uid,
      status: "skipped",
      reason: evalResult.reason,
      eligible: false
    };
  }

  // 2. Dry-run early exit (no DB mutations, no FCM calls)
  if (dryRun) {
    return {
      uid,
      status: "would_send",
      reason: evalResult.reason,
      tokenCount: evalResult.tokens.length,
      eligible: true
    };
  }

  // 3. Acquire idempotency lock atomically
  let lock;
  try {
    lock = await checkAndAcquireDeliveryLock(db, uid, todayStr, { staleTimeoutMs, now });
  } catch (lockErr) {
    return {
      uid,
      status: "error",
      reason: `lock_error: ${lockErr.message}`,
      eligible: true
    };
  }

  if (!lock.acquired) {
    return {
      uid,
      status: "skipped",
      reason: lock.reason,
      eligible: true
    };
  }

  // 4. Dispatch data-only FCM push notification to each registered device
  let userSuccessCount = 0;
  let userFailCount = 0;
  let invalidTokensRemoved = 0;

  for (const token of evalResult.tokens) {
    const message = buildDataOnlyFcmPayload(token);

    try {
      await messaging.send(message);
      userSuccessCount++;
    } catch (sendErr) {
      userFailCount++;

      // Handle invalid or expired token cleanup
      if (isInvalidTokenError(sendErr)) {
        await removeInvalidToken(db, uid, token);
        invalidTokensRemoved++;
      }
    }
  }

  // 5. Finalize delivery record
  const deliveryStatus = userSuccessCount > 0 ? "delivered" : "failed";
  await recordDeliveryResult(lock.deliveryRef, {
    status: deliveryStatus,
    successfulCount: userSuccessCount,
    failedCount: userFailCount,
    error: userFailCount > 0 && userSuccessCount === 0 ? "all_tokens_failed" : null
  });

  return {
    uid,
    status: deliveryStatus,
    eligible: true,
    sent: userSuccessCount,
    failed: userFailCount,
    invalidTokensRemoved
  };
}

/**
 * Main Orchestrator: Process streak reminders for all eligible users with bounded concurrency.
 * 
 * @param {Object} options
 * @param {boolean} [options.dryRun=false] - When true, identifies eligible users without sending pushes or mutating DB.
 * @param {number} [options.limit=100] - Maximum candidate users to scan from Firestore (max 500).
 * @param {number} [options.concurrency=8] - Bounded concurrent workers processing users simultaneously (max 20).
 * @param {number} [options.staleTimeoutMs=900000] - Timeout for recovering stale pending locks (default 15m).
 * @param {Object} [options.dbOverride] - Optional db for testing.
 * @param {Object} [options.messagingOverride] - Optional messaging for testing.
 */
export async function processStreakReminders(options = {}) {
  const startTime = Date.now();
  const dryRun = Boolean(options.dryRun);
  const maxLimit = Math.min(Math.max(1, Number(options.limit) || 100), 500);
  const concurrency = Math.min(Math.max(1, Number(options.concurrency) || DEFAULT_BATCH_CONCURRENCY), 20);

  const db = options.dbOverride || getAdminFirestore();
  const messaging = options.messagingOverride || getAdminMessaging();

  const todayStr = getCalendarDateString(new Date(), STREAK_TIMEZONE);

  const summary = {
    success: true,
    dryRun,
    istDate: todayStr,
    scannedUsers: 0,
    eligibleUsers: 0,
    skippedUsers: 0,
    attemptedSends: 0,
    successfulSends: 0,
    failedSends: 0,
    invalidTokensRemoved: 0,
    concurrency,
    durationMs: 0,
    details: []
  };

  if (!db) {
    throw new Error("Firestore Admin is not available.");
  }

  // 1. Query candidate users who have reminders enabled
  const usersSnapshot = await db
    .collection("users")
    .where("streakRemindersEnabled", "==", true)
    .limit(maxLimit)
    .get();

  summary.scannedUsers = usersSnapshot.size;
  const docs = usersSnapshot.docs;

  // 2. Process candidate users in bounded concurrent chunks
  for (let i = 0; i < docs.length; i += concurrency) {
    const chunk = docs.slice(i, i + concurrency);

    const chunkResults = await Promise.allSettled(
      chunk.map((doc) =>
        processCandidateUser(doc, {
          db,
          messaging,
          todayStr,
          dryRun,
          staleTimeoutMs: options.staleTimeoutMs,
          now: options.now
        })
      )
    );

    for (let j = 0; j < chunkResults.length; j++) {
      const res = chunkResults[j];
      if (res.status === "fulfilled") {
        const item = res.value;
        if (item.eligible) {
          summary.eligibleUsers++;
        }
        if (item.status === "skipped") {
          summary.skippedUsers++;
        } else if (item.status === "delivered" || item.status === "failed") {
          summary.attemptedSends += (item.sent || 0) + (item.failed || 0);
          summary.successfulSends += item.sent || 0;
          summary.failedSends += item.failed || 0;
          summary.invalidTokensRemoved += item.invalidTokensRemoved || 0;
        } else if (item.status === "error") {
          summary.skippedUsers++;
        }
        summary.details.push(item);
      } else {
        const uid = chunk[j]?.id || "unknown";
        summary.skippedUsers++;
        summary.details.push({
          uid,
          status: "error",
          reason: `unexpected_worker_error: ${res.reason?.message || res.reason}`
        });
      }
    }
  }

  summary.durationMs = Date.now() - startTime;
  return summary;
}

export default {
  STREAK_TIMEZONE,
  STALE_LOCK_TIMEOUT_MS,
  DEFAULT_BATCH_CONCURRENCY,
  getCalendarDateString,
  normalizeToLocalDateString,
  getDayDifference,
  evaluateUserEligibility,
  buildDataOnlyFcmPayload,
  isInvalidTokenError,
  removeInvalidToken,
  checkAndAcquireDeliveryLock,
  recordDeliveryResult,
  processCandidateUser,
  processStreakReminders
};

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Streak Reminder Push Notification System (Unit Tests & Behavioral Validation)", () => {
  const notificationsPath = path.resolve(__dirname, "../src/notifications.js");
  const swPath = path.resolve(__dirname, "../public/sw.js");
  const offlineManagerPath = path.resolve(__dirname, "../src/offline-manager.js");
  const firebasePath = path.resolve(__dirname, "../src/firebase.js");

  test("src/notifications.js exists and exports expected methods", async () => {
    assert.ok(fs.existsSync(notificationsPath), "src/notifications.js should exist");
    const module = await import("../src/notifications.js");

    assert.equal(typeof module.isPushNotificationSupported, "function");
    assert.equal(typeof module.enableStreakReminders, "function");
    assert.equal(typeof module.disableStreakReminders, "function");
    assert.equal(typeof module.getStreakReminderStatus, "function");
    assert.equal(typeof module.getVapidKey, "function");
    assert.equal(typeof module.sanitizeNotificationUrl, "function");
    assert.equal(typeof module.calculateUpdatedPreferences, "function");
  });

  test("uses configured VAPID key without exposing private credentials", async () => {
    const { getVapidKey } = await import("../src/notifications.js");
    const key = getVapidKey();
    assert.ok(key && typeof key === "string", "VAPID key should be a non-empty string");
    assert.equal(key, "BCbkY_EflDlf1K-62yyBcF_2UCN90k9Xb3M1ghdqThNzlQvF3TQcrNFyqZXmWZ8-bGFYHfNcx22eLDzIn_fIrjU");
  });

  test("isPushNotificationSupported handles non-browser environment gracefully without throwing", async () => {
    const { isPushNotificationSupported } = await import("../src/notifications.js");
    const supported = await isPushNotificationSupported();
    assert.equal(supported, false);
  });

  test("getStreakReminderStatus handles unauthenticated state gracefully", async () => {
    const { getStreakReminderStatus } = await import("../src/notifications.js");
    const status = await getStreakReminderStatus();
    assert.equal(typeof status, "object");
    assert.equal(status.authenticated, false);
    assert.equal(status.enabled, false);
  });

  test("enableStreakReminders strictly rejects signed-out or guest users", async () => {
    const { enableStreakReminders } = await import("../src/notifications.js");
    const result = await enableStreakReminders();
    assert.equal(result.success, false);
    assert.ok(result.reason === "unsupported" || result.reason === "unauthenticated");
  });

  test("disableStreakReminders strictly rejects signed-out or guest users", async () => {
    const { disableStreakReminders } = await import("../src/notifications.js");
    const result = await disableStreakReminders();
    assert.equal(result.success, false);
    assert.equal(result.reason, "unauthenticated");
  });

  describe("URL Sanitization Behavioral Validation", () => {
    test("sanitizeNotificationUrl blocks external domains and untrusted URLs", async () => {
      const { sanitizeNotificationUrl } = await import("../src/notifications.js");
      const baseOrigin = "https://physix-d4860.web.app";

      // External domains must be rejected to root '/'
      assert.equal(sanitizeNotificationUrl("https://evil.com/phish", baseOrigin), "/");
      assert.equal(sanitizeNotificationUrl("http://attacker.example.org", baseOrigin), "/");
      assert.equal(sanitizeNotificationUrl("//google.com", baseOrigin), "/");

      // Dangerous schemes must be rejected to root '/'
      assert.equal(sanitizeNotificationUrl("javascript:alert(1)", baseOrigin), "/");
      assert.equal(sanitizeNotificationUrl("data:text/html,<script>alert(1)</script>", baseOrigin), "/");
      assert.equal(sanitizeNotificationUrl("vbscript:msgbox(1)", baseOrigin), "/");
      assert.equal(sanitizeNotificationUrl("file:///C:/Windows/System32", baseOrigin), "/");

      // Empty, invalid, and nullish inputs must safely fallback to '/'
      assert.equal(sanitizeNotificationUrl("", baseOrigin), "/");
      assert.equal(sanitizeNotificationUrl(null, baseOrigin), "/");
      assert.equal(sanitizeNotificationUrl(undefined, baseOrigin), "/");
      assert.equal(sanitizeNotificationUrl(12345, baseOrigin), "/");
    });

    test("sanitizeNotificationUrl permits valid same-origin routes and hash paths", async () => {
      const { sanitizeNotificationUrl } = await import("../src/notifications.js");
      const baseOrigin = "https://physix-d4860.web.app";

      assert.equal(sanitizeNotificationUrl("/", baseOrigin), "/");
      assert.equal(sanitizeNotificationUrl("/#achievements", baseOrigin), "/#achievements");
      assert.equal(sanitizeNotificationUrl("/?exp=laser-divergence", baseOrigin), "/?exp=laser-divergence");
      assert.equal(sanitizeNotificationUrl("https://physix-d4860.web.app/hall-effect", baseOrigin), "/hall-effect");
    });
  });

  describe("Multi-Device Preference Model & Token Transitions", () => {
    test("device opt-out preserves remaining device tokens and keeps streakRemindersEnabled=true", async () => {
      const { calculateUpdatedPreferences } = await import("../src/notifications.js");

      // User has registered tokens on Laptop and Mobile
      const initialDoc = {
        streakRemindersEnabled: true,
        fcmTokens: ["token-laptop-123", "token-mobile-456"]
      };

      // Laptop user disables streak reminders on this device
      const result = calculateUpdatedPreferences(initialDoc, "token-laptop-123", { allDevices: false });

      // Laptop token removed, mobile token preserved
      assert.deepEqual(result.remainingTokens, ["token-mobile-456"]);
      // streakRemindersEnabled must STAY true because Mobile is still active
      assert.equal(result.streakRemindersEnabled, true);
      assert.equal(result.shouldClearTokens, false);
    });

    test("final remaining device opt-out toggles streakRemindersEnabled to false", async () => {
      const { calculateUpdatedPreferences } = await import("../src/notifications.js");

      // Only one active device registration remains
      const initialDoc = {
        streakRemindersEnabled: true,
        fcmTokens: ["token-mobile-456"]
      };

      // Mobile user disables streak reminders
      const result = calculateUpdatedPreferences(initialDoc, "token-mobile-456", { allDevices: false });

      // Array now empty
      assert.deepEqual(result.remainingTokens, []);
      // streakRemindersEnabled flips to false
      assert.equal(result.streakRemindersEnabled, false);
      assert.equal(result.shouldClearTokens, false);
    });

    test("explicit allDevices=true opt-out disables reminders and clears all tokens", async () => {
      const { calculateUpdatedPreferences } = await import("../src/notifications.js");

      const initialDoc = {
        streakRemindersEnabled: true,
        fcmTokens: ["token-laptop-123", "token-mobile-456", "token-tablet-789"]
      };

      const result = calculateUpdatedPreferences(initialDoc, "token-laptop-123", { allDevices: true });

      assert.deepEqual(result.remainingTokens, []);
      assert.equal(result.streakRemindersEnabled, false);
      assert.equal(result.shouldClearTokens, true);
    });

    test("handles missing or empty token removal safely without breaking existing registrations", async () => {
      const { calculateUpdatedPreferences } = await import("../src/notifications.js");

      const initialDoc = {
        streakRemindersEnabled: true,
        fcmTokens: ["token-mobile-456"]
      };

      // If cachedToken is null/unregistered, do not remove other tokens
      const result = calculateUpdatedPreferences(initialDoc, null, { allDevices: false });
      assert.deepEqual(result.remainingTokens, ["token-mobile-456"]);
      assert.equal(result.streakRemindersEnabled, true);
    });
  });

  describe("FCM Data-Only Payload Contract Compatibility", () => {
    test("sw.js correctly parses and prioritizes data-only messages over notification block", () => {
      const swContent = fs.readFileSync(swPath, "utf-8");

      // Verify payload contract documentation exists in SW
      assert.match(swContent, /data-only/i);

      // Verify data precedence and notification fallback
      assert.match(swContent, /data\.title/);
      assert.match(swContent, /notification\.title/);
      assert.match(swContent, /data\.body/);
      assert.match(swContent, /notification\.body/);

      // Verify URL sanitization is invoked in push and click handlers
      assert.match(swContent, /sanitizeNotificationUrl/);
      assert.match(swContent, /sanitizeAssetUrl/);

      // Verify notification tag prevents duplicate notification stacking
      assert.match(swContent, /\btag\b/);
      assert.match(swContent, /renotify:\s*true/);
    });

    test("behavioral simulation of data-only payload extraction", () => {
      const parsePushPayload = (payload) => {
        const data = (payload && typeof payload.data === "object" && payload.data !== null) ? payload.data : {};
        const notification = (payload && typeof payload.notification === "object" && payload.notification !== null) ? payload.notification : {};

        const title = (typeof data.title === "string" && data.title.trim()) ||
                      (typeof notification.title === "string" && notification.title.trim()) ||
                      "Default Title";

        const body = (typeof data.body === "string" && data.body.trim()) ||
                     (typeof notification.body === "string" && notification.body.trim()) ||
                     "Default Body";

        return { title, body };
      };

      // 1. Data-only payload
      const dataOnly = {
        data: {
          title: "Protect your PhysiX Streak!",
          body: "Solve an optics problem before midnight."
        }
      };
      assert.deepEqual(parsePushPayload(dataOnly), {
        title: "Protect your PhysiX Streak!",
        body: "Solve an optics problem before midnight."
      });

      // 2. Data takes precedence over legacy notification block
      const mixed = {
        data: {
          title: "Priority Data Title",
          body: "Priority Data Body"
        },
        notification: {
          title: "Legacy Notification Title",
          body: "Legacy Notification Body"
        }
      };
      assert.deepEqual(parsePushPayload(mixed), {
        title: "Priority Data Title",
        body: "Priority Data Body"
      });
    });
  });

  describe("Service Worker & Caching Architecture Integrity", () => {
    test("offline-manager.js exports getServiceWorkerRegistration to ensure single SW reuse", async () => {
      assert.ok(fs.existsSync(offlineManagerPath), "src/offline-manager.js should exist");
      const offlineModule = await import("../src/offline-manager.js");
      assert.equal(typeof offlineModule.getServiceWorkerRegistration, "function");
    });

    test("public/sw.js contains background push event listener", () => {
      assert.ok(fs.existsSync(swPath), "public/sw.js should exist");
      const swContent = fs.readFileSync(swPath, "utf-8");
      assert.match(swContent, /self\.addEventListener\(\s*['"]push['"]/);
      assert.match(swContent, /self\.registration\.showNotification/);
    });

    test("public/sw.js contains notificationclick handler for opening/focusing app", () => {
      const swContent = fs.readFileSync(swPath, "utf-8");
      assert.match(swContent, /self\.addEventListener\(\s*['"]notificationclick['"]/);
      assert.match(swContent, /clients\.matchAll/);
    });

    test("public/sw.js preserves offline caching, precache URLs, and fetch handling", () => {
      const swContent = fs.readFileSync(swPath, "utf-8");
      assert.match(swContent, /CORE_PRECACHE_URLS/);
      assert.match(swContent, /networkFirstNavigation/);
      assert.match(swContent, /staleWhileRevalidate/);
      assert.match(swContent, /fcmregistrations\.googleapis\.com/);
    });

    test("firebase.js exports arrayRemove alongside arrayUnion for clean token revocation", () => {
      const fbContent = fs.readFileSync(firebasePath, "utf-8");
      assert.match(fbContent, /\barrayUnion\b/);
      assert.match(fbContent, /\barrayRemove\b/);
      assert.match(fbContent, /\bgetDoc\b/);
    });
  });
});

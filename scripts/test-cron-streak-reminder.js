import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  STREAK_TIMEZONE,
  STALE_LOCK_TIMEOUT_MS,
  DEFAULT_BATCH_CONCURRENCY,
  getCalendarDateString,
  normalizeToLocalDateString,
  getDayDifference,
  evaluateUserEligibility,
  buildDataOnlyFcmPayload,
  isInvalidTokenError,
  checkAndAcquireDeliveryLock,
  recordDeliveryResult,
  removeInvalidToken,
  processCandidateUser,
  processStreakReminders
} from "../server/services/streak-reminder-service.js";
import {
  timingSafeVerifySecret,
  cronAuthMiddleware
} from "../server/routes/cron.js";
import crypto from "node:crypto";
import { deleteApp, getApps } from "firebase-admin/app";
import {
  formatPrivateKey,
  isFirebaseAdminConfigured,
  setMockFirebaseAdmin,
  getAdminApp,
  getAdminFirestore,
  getAdminMessaging,
  _resetAdminStateForTesting
} from "../server/firebase-admin.js";

describe("Stage 4: Server-Side Streak Reminder Cron Endpoint & Service (Targeted Fixes)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    _resetAdminStateForTesting();
  });

  afterEach(async () => {
    process.env = { ...originalEnv };
    _resetAdminStateForTesting();
    for (const app of getApps()) {
      try {
        await deleteApp(app);
      } catch (_) {}
    }
  });

  describe("1. Firebase Admin Initialization & Security", () => {
    test("formatPrivateKey handles escaped newlines and outer quotes properly", () => {
      const raw = '"-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3\\n-----END PRIVATE KEY-----\\n"';
      const formatted = formatPrivateKey(raw);
      assert.ok(!formatted.startsWith('"'));
      assert.ok(!formatted.endsWith('"'));
      assert.ok(formatted.includes("\n"));
      assert.ok(!formatted.includes("\\n"));
    });

    test("isFirebaseAdminConfigured returns false when env variables are missing", () => {
      delete process.env.FIREBASE_PROJECT_ID;
      delete process.env.FIREBASE_CLIENT_EMAIL;
      delete process.env.FIREBASE_PRIVATE_KEY;
      delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

      assert.equal(isFirebaseAdminConfigured(), false);
    });

    test("isFirebaseAdminConfigured returns true when required credentials exist", () => {
      process.env.FIREBASE_PROJECT_ID = "physix-d4860";
      process.env.FIREBASE_CLIENT_EMAIL = "test@physix-d4860.iam.gserviceaccount.com";
      process.env.FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIE\n-----END PRIVATE KEY-----";

      assert.equal(isFirebaseAdminConfigured(), true);
    });

    test("getAdminApp throws sanitized error when required environment variables are missing", () => {
      delete process.env.FIREBASE_CLIENT_EMAIL;
      delete process.env.FIREBASE_PRIVATE_KEY;
      delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

      assert.throws(
        () => getAdminApp(),
        (err) => err.message.includes("Firebase Admin credentials are not configured")
      );
    });

    test("getAdminApp throws error when private key formatting is invalid without crashing on undefined properties", () => {
      process.env.FIREBASE_PROJECT_ID = "physix-d4860";
      process.env.FIREBASE_CLIENT_EMAIL = "test@physix-d4860.iam.gserviceaccount.com";
      process.env.FIREBASE_PRIVATE_KEY = "7c12dd8023a3833f513a8cebd2b50b089df8d9d8"; // invalid PEM key

      assert.throws(
        () => getAdminApp(),
        (err) => err.message.includes("Firebase Admin initialization failed")
      );
    });

    test("getAdminApp initializes singleton app, reuses existing app, and provides modular Firestore/Messaging", () => {
      const { privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" }
      });

      process.env.FIREBASE_PROJECT_ID = "physix-d4860";
      process.env.FIREBASE_CLIENT_EMAIL = "test@physix-d4860.iam.gserviceaccount.com";
      process.env.FIREBASE_PRIVATE_KEY = privateKey;

      // 1. First-time initialization
      const app1 = getAdminApp();
      assert.ok(app1);
      assert.equal(app1.name, "[DEFAULT]");

      // 2. Reuse through internal singleton cache
      const app2 = getAdminApp();
      assert.strictEqual(app1, app2);

      // 3. Modular Firestore and Messaging instances
      const db1 = getAdminFirestore();
      assert.ok(db1);
      const db2 = getAdminFirestore();
      assert.strictEqual(db1, db2);

      const msg1 = getAdminMessaging();
      assert.ok(msg1);
      const msg2 = getAdminMessaging();
      assert.strictEqual(msg1, msg2);

      // 4. Reuse when singleton is reset but getApps() already has an app
      _resetAdminStateForTesting();
      const app3 = getAdminApp();
      assert.strictEqual(app1, app3);
    });

    test("setMockFirebaseAdmin allows tests to inject custom mocks and overrides SDK", () => {
      const mockApp = { name: "mock-app" };
      const mockDb = { collection: () => {} };
      const mockMsg = { send: () => {} };

      setMockFirebaseAdmin({
        app: mockApp,
        firestore: mockDb,
        messaging: mockMsg
      });

      assert.strictEqual(getAdminApp(), mockApp);
      assert.strictEqual(getAdminFirestore(), mockDb);
      assert.strictEqual(getAdminMessaging(), mockMsg);
      assert.equal(isFirebaseAdminConfigured(), true);
    });
  });

  describe("2. Protected Cron Endpoint Authorization & Constant-Time Verification", () => {
    test("timingSafeVerifySecret validates correct secret and rejects incorrect or empty tokens", () => {
      const secret = "super_secure_cron_secret_12345";

      assert.equal(timingSafeVerifySecret(secret, secret), true);
      assert.equal(timingSafeVerifySecret("wrong_secret", secret), false);
      assert.equal(timingSafeVerifySecret("", secret), false);
      assert.equal(timingSafeVerifySecret(null, secret), false);
      assert.equal(timingSafeVerifySecret(secret, null), false);
      assert.equal(timingSafeVerifySecret("short", secret), false);
      assert.equal(timingSafeVerifySecret("super_secure_cron_secret_12345_extra", secret), false);
    });

    test("cronAuthMiddleware rejects requests when CRON_SECRET is not configured on server", () => {
      delete process.env.CRON_SECRET;

      let statusCode = null;
      let jsonPayload = null;
      let nextCalled = false;

      const req = {
        headers: { authorization: "Bearer some_token" }
      };
      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (payload) => {
              jsonPayload = payload;
            }
          };
        }
      };
      const next = () => {
        nextCalled = true;
      };

      cronAuthMiddleware(req, res, next);

      assert.equal(statusCode, 401);
      assert.equal(jsonPayload.success, false);
      assert.match(jsonPayload.error, /CRON_SECRET is not configured/);
      assert.equal(nextCalled, false);
    });

    test("cronAuthMiddleware rejects requests with missing or invalid bearer token", () => {
      process.env.CRON_SECRET = "production_cron_secret_key";

      let statusCode = null;
      let jsonPayload = null;
      let nextCalled = false;

      const req = {
        headers: { authorization: "Bearer invalid_secret_token" }
      };
      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (payload) => {
              jsonPayload = payload;
            }
          };
        }
      };
      const next = () => {
        nextCalled = true;
      };

      cronAuthMiddleware(req, res, next);

      assert.equal(statusCode, 401);
      assert.equal(jsonPayload.success, false);
      assert.match(jsonPayload.error, /Invalid or missing cron secret/);
      assert.equal(nextCalled, false);
    });

    test("cronAuthMiddleware accepts valid bearer authorization header and calls next()", () => {
      process.env.CRON_SECRET = "production_cron_secret_key";

      let nextCalled = false;
      const req = {
        headers: { authorization: "Bearer production_cron_secret_key" }
      };
      const res = {};
      const next = () => {
        nextCalled = true;
      };

      cronAuthMiddleware(req, res, next);
      assert.equal(nextCalled, true);
    });

    test("cronAuthMiddleware accepts valid x-cron-secret header", () => {
      process.env.CRON_SECRET = "production_cron_secret_key";

      let nextCalled = false;
      const req = {
        headers: { "x-cron-secret": "production_cron_secret_key" }
      };
      const res = {};
      const next = () => {
        nextCalled = true;
      };

      cronAuthMiddleware(req, res, next);
      assert.equal(nextCalled, true);
    });
  });

  describe("3. Calendar Date Normalization & IST Boundaries", () => {
    test("getCalendarDateString formats accurately in Asia/Kolkata", () => {
      const utcDate = new Date("2026-10-19T20:00:00Z");
      const istStr = getCalendarDateString(utcDate, STREAK_TIMEZONE);
      assert.equal(istStr, "2026-10-20");
    });

    test("getDayDifference calculates consecutive day difference accurately", () => {
      assert.equal(getDayDifference("2026-10-19", "2026-10-20"), 1);
      assert.equal(getDayDifference("2026-10-19", "2026-10-19"), 0);
      assert.equal(getDayDifference("2026-10-18", "2026-10-20"), 2);
      assert.equal(getDayDifference("2026-10-20", "2026-10-19"), -1);
    });
  });

  describe("4. Fix 1: Activity Date Precedence & Streak Eligibility", () => {
    const todayStr = "2026-10-20";
    const yesterdayStr = "2026-10-19";
    const twoDaysAgoStr = "2026-10-18";

    test("lastLoginDate two days ago and lastActiveDate yesterday -> eligible", () => {
      const user = {
        streakRemindersEnabled: true,
        streak: 5,
        lastLoginDate: twoDaysAgoStr, // Logged in 2 days ago
        lastActiveDate: yesterdayStr, // Performed lab experiment yesterday!
        fcmTokens: ["token_1"]
      };

      const result = evaluateUserEligibility(user, todayStr);
      assert.equal(result.eligible, true);
      assert.equal(result.reason, "streak_at_risk");
    });

    test("lastLoginDate yesterday and lastActiveDate two days ago -> eligible", () => {
      const user = {
        streakRemindersEnabled: true,
        streak: 3,
        lastLoginDate: yesterdayStr, // Logged in yesterday
        lastActiveDate: twoDaysAgoStr, // Old experiment activity
        fcmTokens: ["token_1"]
      };

      const result = evaluateUserEligibility(user, todayStr);
      assert.equal(result.eligible, true);
      assert.equal(result.reason, "streak_at_risk");
    });

    test("skips when either lastLoginDate or lastActiveDate is today", () => {
      // Case A: lastLoginDate is today
      const userA = {
        streakRemindersEnabled: true,
        streak: 5,
        lastLoginDate: todayStr,
        lastActiveDate: yesterdayStr,
        fcmTokens: ["token_1"]
      };
      const resultA = evaluateUserEligibility(userA, todayStr);
      assert.equal(resultA.eligible, false);
      assert.equal(resultA.reason, "already_active_today");

      // Case B: lastActiveDate is today
      const userB = {
        streakRemindersEnabled: true,
        streak: 5,
        lastLoginDate: yesterdayStr,
        lastActiveDate: todayStr,
        fcmTokens: ["token_1"]
      };
      const resultB = evaluateUserEligibility(userB, todayStr);
      assert.equal(resultB.eligible, false);
      assert.equal(resultB.reason, "already_active_today");
    });

    test("both fields missing or invalid -> conservative skip", () => {
      const user = {
        streakRemindersEnabled: true,
        streak: 4,
        lastLoginDate: null,
        lastActiveDate: "invalid-date-string",
        fcmTokens: ["token_1"]
      };

      const result = evaluateUserEligibility(user, todayStr);
      assert.equal(result.eligible, false);
      assert.equal(result.reason, "missing_activity_date_conservative_skip");
    });

    test("both fields older than yesterday -> streak already expired", () => {
      const user = {
        streakRemindersEnabled: true,
        streak: 10,
        lastLoginDate: twoDaysAgoStr,
        lastActiveDate: twoDaysAgoStr,
        fcmTokens: ["token_1"]
      };

      const result = evaluateUserEligibility(user, todayStr);
      assert.equal(result.eligible, false);
      assert.equal(result.reason, "streak_already_expired");
    });

    test("skips users with disabled streak reminders or non-positive streak", () => {
      assert.equal(
        evaluateUserEligibility({ streakRemindersEnabled: false, streak: 5, lastLoginDate: yesterdayStr, fcmTokens: ["t"] }, todayStr).reason,
        "reminders_disabled"
      );
      assert.equal(
        evaluateUserEligibility({ streakRemindersEnabled: true, streak: 0, lastLoginDate: yesterdayStr, fcmTokens: ["t"] }, todayStr).reason,
        "zero_or_negative_streak"
      );
      assert.equal(
        evaluateUserEligibility({ streakRemindersEnabled: true, streak: 2, lastLoginDate: yesterdayStr, fcmTokens: [] }, todayStr).reason,
        "no_fcm_tokens"
      );
    });
  });

  describe("5. Fix 2: Stale Pending Delivery Lock Recovery", () => {
    function createMockLockDb(initialDeliveryDoc = null) {
      let docData = initialDeliveryDoc ? { ...initialDeliveryDoc } : null;

      return {
        _docData: () => docData,
        collection(colName) {
          assert.equal(colName, "streak_reminder_deliveries");
          return {
            doc(id) {
              return {
                id,
                async get() {
                  return {
                    exists: Boolean(docData),
                    data: () => docData || {}
                  };
                },
                async set(data, opts) {
                  if (opts?.merge && docData) {
                    docData = { ...docData, ...data };
                  } else {
                    docData = { ...data };
                  }
                }
              };
            }
          };
        },
        async runTransaction(updateFn) {
          const transaction = {
            async get(docRef) {
              return await docRef.get();
            },
            set(docRef, data, opts) {
              return docRef.set(data, opts);
            }
          };
          return await updateFn(transaction);
        }
      };
    }

    test("fresh pending lock within 15 minutes is skipped (active lock protection)", async () => {
      const now = new Date("2026-10-20T15:30:00Z");
      // Lock attempted 5 minutes ago (< 15 mins)
      const fiveMinsAgo = new Date("2026-10-20T15:25:00Z").toISOString();

      const mockDb = createMockLockDb({
        status: "pending",
        attemptedAt: fiveMinsAgo
      });

      const result = await checkAndAcquireDeliveryLock(mockDb, "user_1", "2026-10-20", {
        now,
        staleTimeoutMs: STALE_LOCK_TIMEOUT_MS
      });

      assert.equal(result.acquired, false);
      assert.equal(result.reason, "pending_lock_active");
    });

    test("stale pending lock older than 15 minutes is recovered safely", async () => {
      const now = new Date("2026-10-20T15:45:00Z");
      // Lock attempted 25 minutes ago (> 15 mins)
      const twentyFiveMinsAgo = new Date("2026-10-20T15:20:00Z").toISOString();

      const mockDb = createMockLockDb({
        status: "pending",
        attemptedAt: twentyFiveMinsAgo
      });

      const result = await checkAndAcquireDeliveryLock(mockDb, "user_1", "2026-10-20", {
        now,
        staleTimeoutMs: STALE_LOCK_TIMEOUT_MS
      });

      assert.equal(result.acquired, true);
      assert.equal(result.recoveredFromStale, true);

      // Verify lock was refreshed
      const updated = mockDb._docData();
      assert.equal(updated.status, "pending");
      assert.equal(updated.recoveredFromStale, true);
      assert.equal(updated.previousAttemptedAt, twentyFiveMinsAgo);
      assert.equal(updated.attemptedAt, now.toISOString());
    });

    test("malformed or missing attemptedAt timestamp is conservatively skipped", async () => {
      const now = new Date("2026-10-20T15:30:00Z");

      const mockDb = createMockLockDb({
        status: "pending",
        attemptedAt: "invalid-timestamp"
      });

      const result = await checkAndAcquireDeliveryLock(mockDb, "user_1", "2026-10-20", { now });
      assert.equal(result.acquired, false);
      assert.equal(result.reason, "malformed_pending_lock_skipped");
    });

    test("delivered record strictly blocks subsequent attempts", async () => {
      const mockDb = createMockLockDb({
        status: "delivered",
        deliveredAt: "2026-10-20T15:30:00Z"
      });

      const result = await checkAndAcquireDeliveryLock(mockDb, "user_1", "2026-10-20");
      assert.equal(result.acquired, false);
      assert.equal(result.reason, "already_delivered_today");
    });

    test("failed record is retryable", async () => {
      const now = new Date("2026-10-20T15:40:00Z");
      const mockDb = createMockLockDb({
        status: "failed",
        error: "network_timeout"
      });

      const result = await checkAndAcquireDeliveryLock(mockDb, "user_1", "2026-10-20", { now });
      assert.equal(result.acquired, true);
      assert.equal(result.isRetry, true);
      assert.equal(mockDb._docData().status, "pending");
      assert.equal(mockDb._docData().retryAttempt, true);
    });
  });

  describe("6. Fix 3: Bounded Concurrency & Multi-User Orchestration", () => {
    function createMockOrchestratorDb(initialUsers = {}, initialDeliveries = {}) {
      const users = { ...initialUsers };
      const deliveries = { ...initialDeliveries };

      return {
        _users: users,
        _deliveries: deliveries,
        collection(colName) {
          if (colName === "users") {
            return {
              where(field, op, val) {
                return {
                  limit(n) {
                    return {
                      async get() {
                        const matching = Object.entries(users)
                          .filter(([_, data]) => data[field] === val)
                          .slice(0, n);

                        return {
                          size: matching.length,
                          docs: matching.map(([id, data]) => ({
                            id,
                            data: () => data
                          }))
                        };
                      }
                    };
                  }
                };
              },
              doc(id) {
                return {
                  id,
                  async get() {
                    return {
                      exists: Boolean(users[id]),
                      data: () => users[id] || {}
                    };
                  },
                  async set(data, opts) {
                    const resolved = { ...data };
                    if (resolved.fcmTokens && Array.isArray(resolved.fcmTokens.elements)) {
                      const toRemove = new Set(resolved.fcmTokens.elements);
                      const current = Array.isArray(users[id]?.fcmTokens) ? users[id].fcmTokens : [];
                      resolved.fcmTokens = current.filter((t) => !toRemove.has(t));
                    }
                    if (opts?.merge && users[id]) {
                      users[id] = { ...users[id], ...resolved };
                    } else {
                      users[id] = { ...resolved };
                    }
                  }
                };
              }
            };
          }

          if (colName === "streak_reminder_deliveries") {
            return {
              doc(id) {
                return {
                  id,
                  async get() {
                    return {
                      exists: Boolean(deliveries[id]),
                      data: () => deliveries[id] || {}
                    };
                  },
                  async set(data, opts) {
                    if (opts?.merge && deliveries[id]) {
                      deliveries[id] = { ...deliveries[id], ...data };
                    } else {
                      deliveries[id] = { ...data };
                    }
                  }
                };
              }
            };
          }

          throw new Error(`Unsupported collection: ${colName}`);
        },

        async runTransaction(updateFn) {
          const transaction = {
            async get(docRef) {
              return await docRef.get();
            },
            set(docRef, data, opts) {
              return docRef.set(data, opts);
            }
          };
          return await updateFn(transaction);
        }
      };
    }

    test("processes multiple users concurrently with accurate summary accounting", async () => {
      const yesterdayStr = getCalendarDateString(new Date(Date.now() - 86400000));
      const todayStr = getCalendarDateString();

      const mockDb = createMockOrchestratorDb({
        user_1: { streakRemindersEnabled: true, streak: 3, lastLoginDate: yesterdayStr, fcmTokens: ["token_1"] },
        user_2: { streakRemindersEnabled: true, streak: 5, lastLoginDate: yesterdayStr, fcmTokens: ["token_2"] },
        user_3: { streakRemindersEnabled: true, streak: 2, lastLoginDate: yesterdayStr, fcmTokens: ["token_3"] },
        user_today: { streakRemindersEnabled: true, streak: 6, lastLoginDate: todayStr, fcmTokens: ["token_4"] }
      });

      const sentTokens = [];
      const mockMessaging = {
        async send(msg) {
          sentTokens.push(msg.token);
          return { messageId: "msg_" + msg.token };
        }
      };

      const result = await processStreakReminders({
        dryRun: false,
        limit: 10,
        concurrency: 2, // Test chunking of size 2
        dbOverride: mockDb,
        messagingOverride: mockMessaging
      });

      assert.equal(result.success, true);
      assert.equal(result.scannedUsers, 4);
      assert.equal(result.eligibleUsers, 3);
      assert.equal(result.skippedUsers, 1);
      assert.equal(result.successfulSends, 3);
      assert.equal(result.failedSends, 0);
      assert.equal(sentTokens.length, 3);
    });

    test("isolated failure: one user failing FCM does not abort remaining batch", async () => {
      const yesterdayStr = getCalendarDateString(new Date(Date.now() - 86400000));

      const mockDb = createMockOrchestratorDb({
        user_success_a: { streakRemindersEnabled: true, streak: 3, lastLoginDate: yesterdayStr, fcmTokens: ["token_a"] },
        user_fail: { streakRemindersEnabled: true, streak: 4, lastLoginDate: yesterdayStr, fcmTokens: ["token_fail"] },
        user_success_b: { streakRemindersEnabled: true, streak: 5, lastLoginDate: yesterdayStr, fcmTokens: ["token_b"] }
      });

      const mockMessaging = {
        async send(msg) {
          if (msg.token === "token_fail") {
            throw new Error("Internal FCM server error");
          }
          return { messageId: "msg_ok" };
        }
      };

      const result = await processStreakReminders({
        dryRun: false,
        limit: 10,
        concurrency: 3,
        dbOverride: mockDb,
        messagingOverride: mockMessaging
      });

      assert.equal(result.scannedUsers, 3);
      assert.equal(result.eligibleUsers, 3);
      assert.equal(result.successfulSends, 2);
      assert.equal(result.failedSends, 1);

      // Verify delivery statuses recorded
      const todayStr = getCalendarDateString();
      assert.equal(mockDb._deliveries[`user_success_a_${todayStr}`].status, "delivered");
      assert.equal(mockDb._deliveries[`user_fail_${todayStr}`].status, "failed");
      assert.equal(mockDb._deliveries[`user_success_b_${todayStr}`].status, "delivered");
    });

    test("multiple tokens per user: partial failure removes only invalid token", async () => {
      const yesterdayStr = getCalendarDateString(new Date(Date.now() - 86400000));

      const mockDb = createMockOrchestratorDb({
        multi_token_user: {
          streakRemindersEnabled: true,
          streak: 8,
          lastLoginDate: yesterdayStr,
          fcmTokens: ["valid_token_1", "invalid_token_stale", "valid_token_2"]
        }
      });

      const mockMessaging = {
        async send(msg) {
          if (msg.token === "invalid_token_stale") {
            const err = new Error("Token not registered");
            err.code = "messaging/registration-token-not-registered";
            throw err;
          }
          return { messageId: "msg_ok" };
        }
      };

      const result = await processStreakReminders({
        dryRun: false,
        limit: 10,
        dbOverride: mockDb,
        messagingOverride: mockMessaging
      });

      assert.equal(result.attemptedSends, 3);
      assert.equal(result.successfulSends, 2);
      assert.equal(result.failedSends, 1);
      assert.equal(result.invalidTokensRemoved, 1);

      // User has 2 remaining valid tokens; reminders stay enabled!
      const user = mockDb._users["multi_token_user"];
      assert.deepEqual(user.fcmTokens, ["valid_token_1", "valid_token_2"]);
      assert.equal(user.streakRemindersEnabled, true);

      // Overall user delivery is classified as delivered since at least 1 device received it
      const todayStr = getCalendarDateString();
      assert.equal(mockDb._deliveries[`multi_token_user_${todayStr}`].status, "delivered");
    });
  });
});

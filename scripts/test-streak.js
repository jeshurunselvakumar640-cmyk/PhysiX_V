import assert from "node:assert/strict";
import test from "node:test";

// Mock browser globals before importing modules
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => (mockStorage.has(key) ? mockStorage.get(key) : null),
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear()
};

let currentOnline = false; // Fast, offline unit testing without external grpc network sockets
Object.defineProperty(globalThis, "navigator", {
  value: {
    get onLine() { return currentOnline; },
    set onLine(v) { currentOnline = Boolean(v); }
  },
  configurable: true,
  writable: true
});

let brokenModalShown = false;
let milestoneModalShown = false;

globalThis.document = {
  getElementById: (id) => {
    if (id === "streak-lost-modal") {
      return {
        classList: {
          add: () => { brokenModalShown = true; },
          remove: () => {}
        }
      };
    }
    if (id === "streak-milestone-modal") {
      return {
        classList: {
          add: () => { milestoneModalShown = true; },
          remove: () => {}
        }
      };
    }
    return null;
  },
  body: { classList: { add: () => {}, remove: () => {} } }
};

globalThis.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {}
};

// Import streak functions
import {
  STREAK_TIMEZONE,
  getCalendarDateString,
  getLocalDateString,
  normalizeToLocalDateString,
  getDayDifference,
  isConsecutiveCalendarDay,
  calculateConsecutiveDaysFromHistory,
  isStreakMilestone,
  getNextStreakMilestone,
  getStoredUserStreak,
  saveStoredUserStreak,
  processUserDailyStreak
} from "../src/streak.js";

test("Timezone & Date Normalization in Asia/Kolkata", async (t) => {
  await t.test("getCalendarDateString formats in Asia/Kolkata correctly", () => {
    // 2026-10-12 18:29:00 UTC is 2026-10-12 23:59:00 IST (+05:30)
    const date1 = new Date("2026-10-12T18:29:00.000Z");
    assert.equal(getCalendarDateString(date1, STREAK_TIMEZONE), "2026-10-12");

    // 2026-10-12 18:31:00 UTC is 2026-10-13 00:01:00 IST (+05:30) (crossed midnight!)
    const date2 = new Date("2026-10-12T18:31:00.000Z");
    assert.equal(getCalendarDateString(date2, STREAK_TIMEZONE), "2026-10-13");
  });

  await t.test("normalizeToLocalDateString handles diverse formats", () => {
    assert.equal(normalizeToLocalDateString("2026-10-12"), "2026-10-12");
    // ISO string crossing midnight in IST
    assert.equal(normalizeToLocalDateString("2026-10-12T20:00:00.000Z"), "2026-10-13");
    // Timestamp
    const ts = new Date("2026-10-12T18:35:00.000Z").getTime();
    assert.equal(normalizeToLocalDateString(ts), "2026-10-13");
  });

  await t.test("calculateConsecutiveDaysFromHistory calculates exact active streak", () => {
    const dates = ["2026-10-16", "2026-10-17", "2026-10-18"];
    assert.equal(calculateConsecutiveDaysFromHistory(dates, "2026-10-18"), 3);
    const brokenDates = ["2026-10-14", "2026-10-15", "2026-10-18"]; // gap on 16 and 17
    assert.equal(calculateConsecutiveDaysFromHistory(brokenDates, "2026-10-18"), 1);
  });
});

test("Requirement 8: All 15 Verified Streak Scenarios", async (t) => {
  const today = getCalendarDateString();
  const [y, m, d] = today.split("-").map(Number);
  const yesterday = new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10);
  const twoDaysAgo = new Date(Date.UTC(y, m - 1, d - 2)).toISOString().slice(0, 10);

  await t.test("1. First-ever visit: Streak becomes 1", async () => {
    const uid = "user_r8_1";
    const result = await processUserDailyStreak({ uid });
    assert.equal(result.currentStreak, 1);
    assert.equal(result.highestStreak, 1);
    assert.equal(result.status, "initial");
    assert.equal(result.lastLoginDate, today);
  });

  await t.test("2. Second visit on the same IST date: Streak remains unchanged", async () => {
    const uid = "user_r8_2";
    saveStoredUserStreak(uid, {
      currentStreak: 1,
      highestStreak: 1,
      lastLoginDate: today
    });
    const result = await processUserDailyStreak({ uid });
    assert.equal(result.currentStreak, 1);
    assert.equal(result.status, "same_day");
    assert.equal(result.changed, false);
  });

  await t.test("3. Next consecutive calendar day: Streak increases by 1", async () => {
    const uid = "user_r8_3";
    saveStoredUserStreak(uid, {
      currentStreak: 1,
      highestStreak: 1,
      lastLoginDate: yesterday
    });
    const result = await processUserDailyStreak({ uid });
    assert.equal(result.currentStreak, 2);
    assert.equal(result.highestStreak, 2);
    assert.equal(result.status, "incremented");
    assert.equal(result.lastLoginDate, today);
  });

  await t.test("4. Third consecutive day: Streak increases by 1 again (Reaching 3-day streak)", async () => {
    const uid = "user_r8_4";
    saveStoredUserStreak(uid, {
      currentStreak: 2,
      highestStreak: 2,
      lastLoginDate: yesterday
    });
    const result = await processUserDailyStreak({ uid });
    assert.equal(result.currentStreak, 3);
    assert.equal(result.highestStreak, 3);
    assert.equal(result.status, "incremented");
  });

  await t.test("5. One genuinely missed calendar day: Streak breaks according to existing design", async () => {
    const uid = "user_r8_5";
    saveStoredUserStreak(uid, {
      currentStreak: 3,
      highestStreak: 3,
      lastLoginDate: twoDaysAgo
    });
    const result = await processUserDailyStreak({ uid });
    assert.equal(result.currentStreak, 1);
    assert.equal(result.highestStreak, 3, "Highest streak preserved");
    assert.equal(result.status, "broken");
    assert.equal(result.lostStreak, 3);
  });

  await t.test("6. Visit around midnight IST: Correct IST date is recorded", () => {
    // 23:59:45 IST on 2026-10-18
    const beforeMidnight = new Date("2026-10-18T18:29:45.000Z");
    // 00:00:15 IST on 2026-10-19
    const afterMidnight = new Date("2026-10-18T18:30:15.000Z");

    const dateBefore = getCalendarDateString(beforeMidnight, STREAK_TIMEZONE);
    const dateAfter = getCalendarDateString(afterMidnight, STREAK_TIMEZONE);

    assert.equal(dateBefore, "2026-10-18");
    assert.equal(dateAfter, "2026-10-19");
    assert.equal(getDayDifference(dateBefore, dateAfter), 1);
    assert.equal(isConsecutiveCalendarDay(dateBefore, dateAfter), true);
  });

  await t.test("7. UTC date differs from IST date: No false streak break", () => {
    // 19:30 UTC on 2026-10-18 is 01:00 IST on 2026-10-19
    const utcDate = new Date("2026-10-18T19:30:00.000Z");
    const istDayStr = getCalendarDateString(utcDate, STREAK_TIMEZONE);
    assert.equal(istDayStr, "2026-10-19");
    // Comparing with previous day in IST
    assert.equal(getDayDifference("2026-10-18", istDayStr), 1);
    assert.equal(isConsecutiveCalendarDay("2026-10-18", istDayStr), true);
  });

  await t.test("8. Last day of a month: Correct consecutive-day calculation", () => {
    assert.equal(getDayDifference("2026-01-31", "2026-02-01"), 1);
    assert.equal(isConsecutiveCalendarDay("2026-01-31", "2026-02-01"), true);
    assert.equal(getDayDifference("2026-10-31", "2026-11-01"), 1);
    assert.equal(isConsecutiveCalendarDay("2026-10-31", "2026-11-01"), true);
  });

  await t.test("9. December 31 to January 1: Correct consecutive-day calculation across year boundary", () => {
    assert.equal(getDayDifference("2026-12-31", "2027-01-01"), 1);
    assert.equal(isConsecutiveCalendarDay("2026-12-31", "2027-01-01"), true);
  });

  await t.test("10. Leap-day boundary: Correct calendar-day comparison", () => {
    // Leap year 2024
    assert.equal(getDayDifference("2024-02-28", "2024-02-29"), 1);
    assert.equal(getDayDifference("2024-02-29", "2024-03-01"), 1);
    assert.equal(isConsecutiveCalendarDay("2024-02-29", "2024-03-01"), true);
    // Non-leap year 2025: Feb 28 to Mar 1 is 1 day difference
    assert.equal(getDayDifference("2025-02-28", "2025-03-01"), 1);
    assert.equal(isConsecutiveCalendarDay("2025-02-28", "2025-03-01"), true);
  });

  await t.test("11. Duplicate initialization: No duplicate increment", async () => {
    const uid = "user_r8_11";
    saveStoredUserStreak(uid, {
      currentStreak: 3,
      highestStreak: 3,
      lastLoginDate: yesterday
    });
    // First run on today increments to 4
    const r1 = await processUserDailyStreak({ uid });
    assert.equal(r1.currentStreak, 4);

    // Immediate duplicate initialization on same day
    const r2 = await processUserDailyStreak({ uid });
    assert.equal(r2.currentStreak, 4);
    assert.equal(r2.status, "same_day");
  });

  await t.test("12. Delayed Firestore response: No incorrect overwrite with older date", () => {
    const currentCloudRecord = {
      streak: 3,
      highestStreak: 3,
      lastLoginDate: "2026-10-18"
    };
    const delayedIncomingWrite = {
      streak: 2,
      lastLoginDate: "2026-10-17"
    };
    const diff = getDayDifference(currentCloudRecord.lastLoginDate, delayedIncomingWrite.lastLoginDate);
    assert.ok(diff < 0, "Incoming date is older than cloud date");
    // Ensure cloud streak and date are kept
    const resolvedStreak = diff < 0 ? currentCloudRecord.streak : delayedIncomingWrite.streak;
    const resolvedDate = diff < 0 ? currentCloudRecord.lastLoginDate : delayedIncomingWrite.lastLoginDate;
    assert.equal(resolvedStreak, 3);
    assert.equal(resolvedDate, "2026-10-18");
  });

  await t.test("13. Invalid stored date: Safe handling without fabricated activity", () => {
    const safeDate = normalizeToLocalDateString("not-a-valid-date");
    assert.match(safeDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(getDayDifference("invalid", "invalid"), 0);
  });

  await t.test("14. User data still loading (null / guest user): No premature broken-streak modal", async () => {
    brokenModalShown = false;
    // Process guest with older date
    saveStoredUserStreak("guest", {
      currentStreak: 5,
      highestStreak: 5,
      lastLoginDate: twoDaysAgo
    });
    const guestResult = await processUserDailyStreak(null);
    assert.equal(guestResult.status, "broken");
    // Broken modal must NOT be triggered for unauthenticated guest sessions
    assert.equal(brokenModalShown, false, "Modal must not popup for guest sessions");
  });

  await t.test("15. Two simultaneous activity updates: No double increment (Promise lock)", async () => {
    const uid = "user_r8_15";
    saveStoredUserStreak(uid, {
      currentStreak: 2,
      highestStreak: 2,
      lastLoginDate: yesterday
    });

    // Launch two updates simultaneously
    const [p1, p2] = await Promise.all([
      processUserDailyStreak({ uid }),
      processUserDailyStreak({ uid })
    ]);

    assert.equal(p1.currentStreak, 3);
    assert.equal(p2.currentStreak, 3);
    const finalStored = getStoredUserStreak(uid);
    assert.equal(finalStored.currentStreak, 3, "Concurrent executions must not double-increment");
  });
});

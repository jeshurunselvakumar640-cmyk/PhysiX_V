/**
 * PhysiX — Cron Endpoints Router
 * 
 * Provides authenticated server-side endpoints for scheduled maintenance tasks,
 * specifically the daily streak reminder push notification dispatcher.
 * 
 * Security:
 * - Constant-time SHA-256 authorization comparison against process.env.CRON_SECRET.
 * - Rejects any attempt to specify arbitrary user IDs or FCM tokens from client request body.
 * - Protects against timing side-channel attacks.
 * - Never returns service account keys, tokens, or credentials in response.
 */

import { Router } from "express";
import crypto from "crypto";
import { isFirebaseAdminConfigured } from "../firebase-admin.js";
import { processStreakReminders } from "../services/streak-reminder-service.js";

const router = Router();

/**
 * Constant-time verification of cron bearer token against expected server secret.
 * Pre-hashes inputs with SHA-256 to eliminate timing vulnerabilities caused by length differences.
 */
export function timingSafeVerifySecret(providedToken, expectedSecret) {
  if (!providedToken || !expectedSecret) return false;
  if (typeof providedToken !== "string" || typeof expectedSecret !== "string") return false;

  const provided = providedToken.trim();
  const expected = expectedSecret.trim();

  if (!provided || !expected) return false;

  const hashProvided = crypto.createHash("sha256").update(provided).digest();
  const hashExpected = crypto.createHash("sha256").update(expected).digest();

  return crypto.timingSafeEqual(hashProvided, hashExpected);
}

/**
 * Express middleware to enforce cron authorization.
 */
export function cronAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization || "";
  let providedSecret = "";

  if (authHeader.startsWith("Bearer ") || authHeader.startsWith("bearer ")) {
    providedSecret = authHeader.slice(7).trim();
  } else if (req.headers["x-cron-secret"]) {
    providedSecret = String(req.headers["x-cron-secret"]).trim();
  }

  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    console.warn("[Cron API] Access attempt rejected: CRON_SECRET is not configured on the server.");
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Server CRON_SECRET is not configured."
    });
  }

  if (!providedSecret || !timingSafeVerifySecret(providedSecret, expectedSecret)) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid or missing cron secret."
    });
  }

  next();
}

/**
 * Handler for the streak-reminder cron execution.
 */
export async function handleStreakReminder(req, res) {
  try {
    // 1. Verify Firebase Admin is configured before proceeding
    if (!isFirebaseAdminConfigured()) {
      return res.status(503).json({
        success: false,
        error: "Firebase Admin is not configured on the server. Set required credentials."
      });
    }

    // 2. Extract options (strictly ignore any injected user IDs or tokens from request body)
    const dryRun = req.query.dryRun === "true" || req.body?.dryRun === true;
    const limit = Math.min(Math.max(1, parseInt(req.query.limit, 10) || 100), 500);
    const concurrency = req.query.concurrency ? parseInt(req.query.concurrency, 10) : undefined;

    // 3. Execute streak reminder processor
    const summary = await processStreakReminders({ dryRun, limit, concurrency });

    return res.status(200).json({
      success: true,
      message: dryRun
        ? "Dry-run completed successfully. No push notifications were sent."
        : "Streak reminder cron job processed successfully.",
      summary
    });
  } catch (err) {
    console.error("[Cron API] Error running streak reminder job:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error running streak reminder job."
    });
  }
}

// Support both POST (recommended) and GET (Vercel Cron default)
router.post("/streak-reminder", cronAuthMiddleware, handleStreakReminder);
router.get("/streak-reminder", cronAuthMiddleware, handleStreakReminder);

export default router;

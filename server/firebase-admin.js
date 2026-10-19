/**
 * PhysiX — Server-Only Firebase Admin SDK Initialization
 * 
 * Secure server-side credential loader and singleton manager for Firebase Admin.
 * Strictly forbidden from being bundled into client or Vite builds.
 * 
 * Required Server-Side Environment Variables:
 * - FIREBASE_PROJECT_ID: (e.g., "physix-d4860")
 * - FIREBASE_CLIENT_EMAIL: (e.g., "firebase-adminsdk-xxx@physix-d4860.iam.gserviceaccount.com")
 * - FIREBASE_PRIVATE_KEY: (PEM formatted private key; escaped \n handled automatically)
 * 
 * Optional Alternative:
 * - FIREBASE_SERVICE_ACCOUNT_KEY: (Full JSON string containing project_id, client_email, private_key)
 */

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

let adminApp = null;
let firestoreDb = null;
let messagingService = null;
let mockOverrides = null;

/**
 * For unit testing: Allows tests to inject mock admin instances without requiring live credentials.
 */
export function setMockFirebaseAdmin(mocks) {
  mockOverrides = mocks;
}

/**
 * For unit testing: Clears internal singleton instances.
 */
export function _resetAdminStateForTesting() {
  adminApp = null;
  firestoreDb = null;
  messagingService = null;
  mockOverrides = null;
}

/**
 * Check whether required server-side Firebase Admin credentials are configured.
 */
export function isFirebaseAdminConfigured() {
  if (mockOverrides) return true;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      return Boolean(parsed.project_id && parsed.client_email && parsed.private_key);
    } catch (_) {
      return false;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  return Boolean(projectId && clientEmail && privateKey);
}

/**
 * Format private key to ensure valid PEM format with actual newlines.
 */
export function formatPrivateKey(rawKey) {
  if (!rawKey || typeof rawKey !== "string") return "";
  let key = rawKey.trim();
  // Strip surrounding quotes if wrapped in .env
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n");
}

/**
 * Initialize or return the existing singleton Firebase Admin App.
 */
export function getAdminApp() {
  if (mockOverrides?.app) return mockOverrides.app;

  if (adminApp) return adminApp;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (err) {
      throw new Error(`Failed to initialize Firebase Admin from FIREBASE_SERVICE_ACCOUNT_KEY: ${err.message}`);
    }

    if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
      throw new Error("Failed to initialize Firebase Admin from FIREBASE_SERVICE_ACCOUNT_KEY: Missing required credentials.");
    }

    try {
      adminApp = initializeApp({
        credential: cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: formatPrivateKey(serviceAccount.private_key)
        })
      });
      return adminApp;
    } catch (err) {
      throw new Error(`Failed to initialize Firebase Admin from FIREBASE_SERVICE_ACCOUNT_KEY: ${err.message}`);
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || "physix-d4860";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!clientEmail || !rawKey) {
    throw new Error(
      "Firebase Admin credentials are not configured. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY."
    );
  }

  try {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formatPrivateKey(rawKey)
      })
    });
    return adminApp;
  } catch (err) {
    throw new Error(`Firebase Admin initialization failed: ${err.message}`);
  }
}

/**
 * Obtain Firestore instance for server-side administrative access.
 */
export function getAdminFirestore() {
  if (mockOverrides?.firestore) return mockOverrides.firestore;
  if (firestoreDb) return firestoreDb;

  const app = getAdminApp();
  firestoreDb = getFirestore(app);
  return firestoreDb;
}

/**
 * Obtain Firebase Cloud Messaging instance for server-side push notification dispatch.
 */
export function getAdminMessaging() {
  if (mockOverrides?.messaging) return mockOverrides.messaging;
  if (messagingService) return messagingService;

  const app = getAdminApp();
  messagingService = getMessaging(app);
  return messagingService;
}

export default {
  getAdminApp,
  getAdminFirestore,
  getAdminMessaging,
  isFirebaseAdminConfigured,
  formatPrivateKey,
  setMockFirebaseAdmin,
  _resetAdminStateForTesting
};

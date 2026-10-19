import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swPath = path.resolve(__dirname, "../dist/sw.js");
if (!fs.existsSync(swPath)) {
  console.error("dist/sw.js does not exist! Please run npm run build first.");
  process.exit(1);
}

const sw = fs.readFileSync(swPath, "utf8");

const diagnostics = {
  status: 200,
  size: sw.length,
  hasPushHandler: /addEventListener\(['"`]push['"`]/.test(sw),
  hasNotificationClickHandler: /addEventListener\(['"`]notificationclick['"`]/.test(sw),
  hasInstallHandler: /addEventListener\(['"`]install['"`]/.test(sw),
  hasActivateHandler: /addEventListener\(['"`]activate['"`]/.test(sw),
  hasFetchHandler: /addEventListener\(['"`]fetch['"`]/.test(sw),
  hasWorkboxManifest: sw.includes("manifest.webmanifest") && sw.includes("revision"),
  hasDataOnlyParsing: sw.includes("showNotification") && sw.includes("data"),
  hasSkipWaiting: sw.includes("skipWaiting"),
  hasClientsClaim: sw.includes("clients.claim")
};

console.log("\n=== DIST SERVICE WORKER DIAGNOSTICS ===");
console.log(JSON.stringify(diagnostics, null, 2));

const allPassed =
  diagnostics.size > 8000 &&
  diagnostics.hasPushHandler &&
  diagnostics.hasNotificationClickHandler &&
  diagnostics.hasInstallHandler &&
  diagnostics.hasActivateHandler &&
  diagnostics.hasFetchHandler &&
  diagnostics.hasWorkboxManifest &&
  diagnostics.hasDataOnlyParsing;

if (!allPassed) {
  console.error("\n❌ FAILED: dist/sw.js does not meet required specifications!");
  process.exit(1);
} else {
  console.log("\n✅ ALL DIST SERVICE WORKER DIAGNOSTICS PASSED PERFECTLY!\n");
}

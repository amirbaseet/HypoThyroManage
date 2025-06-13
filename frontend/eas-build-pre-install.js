// eas-build-pre-install.js

// export default async function preInstallHook({ utils }) {
//   await utils.run("npm install --legacy-peer-deps");
// }
const fs = require("fs");
const path = require("path");

const base64 = process.env.GOOGLE_SERVICES_JSON_BASE64;
const outputPath = path.resolve(__dirname, "google-services.json");

if (base64) {
  const buffer = Buffer.from(base64, "base64");
  fs.writeFileSync(outputPath, buffer);
  console.log("✅ google-services.json written from base64 secret.");
} else {
  console.warn("⚠️ GOOGLE_SERVICES_JSON_BASE64 is not defined.");
}

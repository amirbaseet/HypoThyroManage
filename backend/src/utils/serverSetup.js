/**
 * Server Setup Utility
 *
 * Dynamically creates an HTTP or HTTPS server based on environment configuration.
 * If SSL certificates are provided and USE_HTTPS is enabled, an HTTPS server is created.
 * Otherwise, falls back to an HTTP server.
 *
 * Usage:
 *   const { createServer } = require('./serverSetup');
 *   const server = createServer(app);
 *
 * Environment Variables:
 *   USE_HTTPS: (default: "true")
 *     - "true"  => Attempts to load SSL certificates and create an HTTPS server
 *     - "false" => Forces an HTTP server, ignoring SSL certificates
 *
 * SSL Certificate Paths (relative to project root):
 *   - cert/private.key
 *   - cert/certificate.crt
 *
 * @module utils/serverSetup
 */

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

/**
 * Create a server instance (HTTP or HTTPS)
 *
 * @param {Express.Application} app - The Express application instance to attach the server to.
 * @returns {http.Server|https.Server} - The created server instance.
 */

const createServer = (app) => {
console.log("🌐 process.env.USE_HTTPS:", process.env.USE_HTTPS);
const USE_HTTPS = (process.env.USE_HTTPS ?? "true").toLowerCase() === "true";
console.log("🌐 USE_HTTPS:", USE_HTTPS);

  if (USE_HTTPS) {
    try {
      const credentials = {
        key: fs.readFileSync(path.join(__dirname, "../cert/private.key"), "utf8"),
        cert: fs.readFileSync(path.join(__dirname, "../cert/certificate.crt"), "utf8"),
      };

      console.log("🔐 HTTPS server initialized.");
      return https.createServer(credentials, app);
    } catch (error) {
      console.error("❌ Failed to load SSL certificates:", error.message);
      console.log("🔓 Falling back to HTTP server.");
    }
  }

  console.log("🌐 HTTP server initialized.");
  return http.createServer(app);
};

module.exports = { createServer };

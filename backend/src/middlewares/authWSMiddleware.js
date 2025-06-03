/**
 * WebSocket Authentication Middleware
 * 
 * Verifies a JWT token sent during the WebSocket handshake and attaches the decoded user data to the socket.
 * 
 * Usage:
 * - The token must be sent in the `auth` field of the socket handshake:
 *   socket.io-client example:
 *     io("ws://localhost:3001", { auth: { token: "Bearer <JWT>" } });
 * 
 * Behavior:
 * - If valid, attaches decoded user info to `socket.user` and calls `next()`.
 * - If missing or invalid, calls `next()` with an authentication error.
 * 
 * @param {Object} socket - Socket.IO socket object.
 * @param {Function} next - Callback to proceed with or reject the connection.
 */

const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyWSSocketToken = (socket, next) => {
    try {
        // Extract the token from the WebSocket handshake
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Authentication error: No token provided."));
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
            if (err) {
                console.error("❌ Token verification failed:", err.message);
                return next(new Error("Authentication error: Invalid or expired token."));
            }
            socket.userId = decoded.id;
            // Attach user data to socket
            // socket.user = decoded;
            // console.log("✅ WebSocket authenticated:", socket.user);
            next();
        });

    } catch (error) {
        next(new Error("Authentication error: Something went wrong."));
    }
};

module.exports = verifyWSSocketToken;

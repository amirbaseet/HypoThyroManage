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
                return next(new Error("Authentication error: Invalid or expired token."));
            }

            // Attach user data to socket
            socket.user = decoded;
            console.log("✅ WebSocket authenticated:", socket.user);
            next();
        });

    } catch (error) {
        next(new Error("Authentication error: Something went wrong."));
    }
};

module.exports = verifyWSSocketToken;

const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const jwt = require("jsonwebtoken");
const {sendPushNotification} = require("./utils/pushNotifications")

require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL }, // Allow requests from frontend
});

// Store online users with socket IDs
const users = new Map();

// 🔑 Middleware: Authenticate WebSocket connection using JWT
io.use((socket, next) => {
    try {
        console.log("first")
        let token = socket.handshake.auth?.token;
        console.log("🔑 Received Token in WebSocket:", token);

        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        // ✅ Ensure token is correctly handled
        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];  // Remove "Bearer" if included
        }

        jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
            if (err) {
                console.error("❌ Token verification failed:", err.message);
                return next(new Error("Authentication error: Invalid token"));
            }

            socket.userId = decoded.id;
            console.log(`🟢 User ${socket.userId} authenticated`);
            next();
        });

    } catch (error) {
        next(new Error("Authentication error: Token verification failed"));
    }
});


io.on("connection", (socket) => {
    console.log(`🔌 New connection: ${socket.id} (User: ${socket.userId})`);

    // ✅ Store connected user's socket ID
    users.set(socket.userId, socket.id);

    socket.on("sendMessage", async ({ sender, receiver, message }, callback) => {
        if (!sender || !receiver || !message.trim()) {
            return callback({ status: "error", error: "Invalid message data" });
        }

        const receiverSocketId = users.get(receiver);

        if (receiverSocketId) {
            // ✅ Send message via WebSocket if the user is online
            io.to(receiverSocketId).emit("receiveMessage", { sender, message });
        } else {
            // ✅ If user is offline, fetch their Expo push token and send a notification
            try {
                const receiverUser = await User.findById(receiver);

                if (receiverUser?.expoPushToken) {
                    await sendPushNotification(
                        receiverUser.expoPushToken,
                        "New Message",
                        `You have a new message from ${sender}`
                    );
                }
            } catch (error) {
                console.error("❌ Error sending push notification:", error);
            }
        }

        callback({ status: "success" });
    });

    socket.on("disconnect", () => {
        console.log(`🔴 User disconnected: ${socket.userId} (Socket: ${socket.id})`);
        users.delete(socket.userId);
    });
});

module.exports = { io, app, server };
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const User = require("./models/userModels");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: [process.env.CLIENT_URL] },
});

// ✅ Skip authentication for testing
io.on("connection", async (socket) => {
    console.log(`🔌 New connection: ${socket.id}`);

    // ✅ For testing, assign a user ID based on client input
    socket.on("setUserId", (userId) => {
        socket.userId = userId;
        console.log(`🟢 User ${userId} connected!`);
    });

    socket.on("sendMessage", async (data, callback) => {
        try {
            const { sender, receiver, message } = data;
            if (!sender || !receiver || !message.trim()) {
                return callback({ status: "error", error: "Invalid message data" });
            }

            // ✅ Skip user validation for testing
            console.log(`📩 Message from ${sender} to ${receiver}: ${message}`);

            io.emit("receiveMessage", { sender, receiver, message });

            callback({ status: "success" });
        } catch (error) {
            console.error("❌ Error sending message:", error);
            callback({ status: "error", error: "Server error" });
        }
    });

    socket.on("disconnect", () => {
        console.log(`🔴 User disconnected: ${socket.id}`);
    });
});

module.exports = { io, app, server };

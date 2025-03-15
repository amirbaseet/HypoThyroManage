const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const User = require("./models/userModels");
const Message = require("./models/Message");
const {
    generateAESKey,
    encryptMessageAES,
    encryptAESKeyWithRSA
} = require("../src/utils/encryptionUtils");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true
    },
    transports: ["websocket", "polling"]
});

const activeUsers = new Map();

console.log("✅ WebSocket Server initialized...");

io.on("connection", (socket) => {
    console.log(`🔌 New WebSocket connection: ${socket.id}`);

    socket.on("userConnected", async (userId) => {
        try {
            socket.userId = userId;

            if (!activeUsers.has(userId)) {
                activeUsers.set(userId, new Set());
            }
            activeUsers.get(userId).add(socket.id);

            console.log(`🟢 User ${userId} is online on ${activeUsers.get(userId).size} device(s)`);

            const undeliveredMessages = await Message.find({ receiverId: userId, delivered: false });
            for (let msg of undeliveredMessages) {
                io.to(socket.id).emit("receiveMessage", msg);
                msg.delivered = true;
                await msg.save();
            }
        } catch (error) {
            console.error("❌ Error handling user connection:", error);
        }
    });

    socket.on("sendMessage", async (data, callback) => {
        try {
            console.log("📨 Incoming message attempt:", data);
    
            if (!callback || typeof callback !== "function") {
                console.warn("⚠️ Warning: Callback function not provided by client.");
                return; // Exit early if there's no valid callback
            }
    
            const { sender, receiver, message } = data;
            if (!sender || !receiver || !message.trim()) {
                return callback({ status: "error", error: "Invalid message data" });
            }
    
            if (!socket.userId || socket.userId !== sender) {
                return callback({ status: "error", error: "Unauthorized user" });
            }
    
            if (sender === receiver) {
                return callback({ status: "error", error: "Cannot send messages to yourself" });
            }
    
            console.log(`🔎 Fetching public keys...`);
            const receiverUser = await User.findById(receiver).select("publicKey");
            const senderUser = await User.findById(sender).select("privateKey");
    
            if (!receiverUser || !senderUser) {
                return callback({ status: "error", error: "User not found" });
            }
    
            console.log("🔐 Encrypting message...");
            const aesKey = generateAESKey();
            const encryptedAESKey = encryptAESKeyWithRSA(aesKey, receiverUser.publicKey);
            const encryptedMessage = encryptMessageAES(message, aesKey);
    
            console.log("✅ Saving message to database...");
            const newMessage = new Message({
                senderId: sender,
                receiverId: receiver,
                encryptedMessage,
                aesKey: encryptedAESKey,
                delivered: false
            });
    
            await newMessage.save();
    
            const receiverSocketIds = activeUsers.get(receiver) || new Set();
            const senderSocketIds = activeUsers.get(sender) || new Set();
            const payload = { sender, receiver, message };
    
            receiverSocketIds.forEach(socketId => io.to(socketId).emit("receiveMessage", payload));
            senderSocketIds.forEach(socketId => io.to(socketId).emit("receiveMessage", payload));
    
            if (receiverSocketIds.size > 0) {
                newMessage.delivered = true;
                await newMessage.save();
            }
    
            console.log("📤 Message sent successfully!");
            callback({ status: "success", messageId: newMessage._id });
        } catch (error) {
            console.error("❌ Error sending message:", error);
            if (callback && typeof callback === "function") {
                callback({ status: "error", error: error.message });
            }
        }
    });
    

    socket.on("disconnect", () => {
        if (socket.userId) {
            if (activeUsers.has(socket.userId)) {
                activeUsers.get(socket.userId).delete(socket.id);
                if (activeUsers.get(socket.userId).size === 0) {
                    activeUsers.delete(socket.userId);
                    io.emit("userDisconnected", { userId: socket.userId });
                }
            }
            console.log(`🔴 User ${socket.userId} disconnected from ${socket.id}`);
        }
    });

    socket.on("reconnect_attempt", () => {
        console.log("♻️ Attempting to reconnect...");
    });

    socket.on("reconnect", () => {
        console.log("✅ Reconnected successfully!");
    });

    socket.on("connect_error", (error) => {
        console.error("❌ Connection error:", error.message);
    });
});

module.exports = { io, app, server };

const { Server } = require("socket.io");
const https = require("https");
const express = require("express");
const jwt = require("jsonwebtoken");
// const {sendPushNotification} = require("./utils/pushNotifications")
const {sendPushNotificationByToken} = require("../src/utils/notificationService")
require("dotenv").config();
const User = require("../src/models/userModels");
const Message  = require("./models/Message");
const cron = require("node-cron");
const MedicineLog = require("./models/MedicineLog"); // Adjust path if needed
const fs = require("fs");

const app = express();
// 🔐 Load SSL certificate
const credentials = {
    key: fs.readFileSync("cert/private.key", "utf8"),
    cert: fs.readFileSync("cert/certificate.crt", "utf8"),
  };
  
  const server = https.createServer(credentials, app);

  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "*" },
  });
  
// Store online users with socket IDs
const users = new Map();
const activeChats = new Map(); // Tracks which user is actively viewing which chat

// 🔑 Middleware: Authenticate WebSocket connection using JWT
io.use((socket, next) => {
    try {
        let token = socket.handshake.auth?.token;
        // console.log("🔑 Received Token in WebSocket:", token);

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
        const isChatActive = activeChats.get(receiver) === sender;

        if (receiverSocketId) {
            // ✅ Send message via WebSocket if the user is online
            io.to(receiverSocketId).emit("receiveMessage", { sender, message });
                    // 🟡 User is online but not viewing the chat → send push notification
        if (!isChatActive) {
            try {
                const receiverUser = await User.findById(receiver);
                const senderUser = await User.findById(sender);
                if (receiverUser?.pushToken) {
                    const notificationMessage =
                        receiverUser.role === "doctor"
                            ? `You have a new message from ${senderUser.username}`
                            : `You have a new message from your doctor`;

                    await sendPushNotificationByToken(
                        receiverUser.pushToken,
                        "New Message",
                        notificationMessage
                    );
                }
            } catch (error) {
                console.error("❌ Error sending push notification:", error);
            }
        }

        } else {
            // ✅ If user is offline, fetch their Expo push token and send a notification
            try {
                const receiverUser = await User.findById(receiver);
                const senderUser = await User.findById(sender);

                if (receiverUser?.pushToken) {
                    let notificationMessage = "";

                    if (receiverUser.role === "doctor") {
                        notificationMessage = `You have received a message from ${senderUser.username}`;
                    } else if (receiverUser.role === "patient") {
                        notificationMessage = `You have received a message from your doctor`;
                    }
    
                    await sendPushNotificationByToken(
                        receiverUser.pushToken,
                        "New Message",
                        notificationMessage
                    );
                    }
            } catch (error) {
                console.error("❌ Error sending push notification:", error);
            }
        }

        callback({ status: "success" });
    });
    /**
     * ✅ Mark Messages as Read and Notify Sender
     */
    socket.on("markAsRead", async ({ senderId, receiverId }) => {
        try {
            // ✅ Mark messages as read in DB
            await Message.updateMany(
                { senderId, receiverId, read: false },
                { $set: { read: true } }
            );
    
            console.log(`✅ Messages marked as read: ${senderId} → ${receiverId}`);
    
            // ✅ Notify sender (doctor) that their message was read
            const senderSocketId = users.get(senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("messagesRead", { senderId, receiverId });
            }
        } catch (error) {
            console.error("❌ Error marking messages as read:", error);
        }
    });
    //chat open or closed
    socket.on("chatOpened", ({ withUserId }) => {
        activeChats.set(socket.userId, withUserId);
    });
    socket.on("chatClosed", () => {
        activeChats.delete(socket.userId);
    });
        
        /**
     * ✅ Handle User Disconnect
     */
    socket.on("disconnect", () => {
        console.log(`🔴 User disconnected: ${socket.userId} (Socket: ${socket.id})`);
        users.delete(socket.userId);
    });
    });

    // ⏰ Run every day at 12:00 PM server time
cron.schedule("0 12 * * *", async () => {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // 0-11
        const day = today.getDate();

        // 🔍 Find all logs for today where `taken` is false
        const missingLogs = await MedicineLog.find({
            year,
            month,
            day,
            taken: false,
        }).populate("userId");

        for (const log of missingLogs) {
            const user = log.userId;

            if (user?.pushToken) {
                await sendPushNotificationByToken(
                    user.pushToken,
                    "💊 İlaç Hatırlatıcısı",
                    "Bugün ilacınızı almadınız. Lütfen unutmayın!"
                                    );
                console.log(`📤 Reminder sent to ${user.username}`);
            }
        }

        console.log(`✅ Medicine reminders sent at 12:00PM`);
    } catch (error) {
        console.error("❌ Error sending medicine reminders:", error);
    }
});
const sendMorningReminders = async () => {
    try {
        const users = await User.find({ pushToken: { $exists: true, $ne: null } });

        for (const user of users) {
            await sendPushNotificationByToken(
                user.pushToken,
                "Günaydın! ☀️",
                "Bugün tiroid ilacınızı almayı unutmayın!"
            );
            console.log(`📤 Reminder sent to ${user.username}`);
        }

        console.log("✅ 7AM medicine reminders sent to all users.");
    } catch (error) {
        console.error("❌ Error sending 7AM medicine reminders:", error);
    }
};


cron.schedule("0 7 * * *", sendMorningReminders);


module.exports = { io, app, server };
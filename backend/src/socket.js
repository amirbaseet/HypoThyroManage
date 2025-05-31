const { Server } = require("socket.io");
const https = require("https");
const http = require("http");
const express = require("express");
const jwt = require("jsonwebtoken");
// const {sendPushNotification} = require("./utils/pushNotifications")
const {sendPushNotificationByToken} = require("../src/utils/notificationService")
require("dotenv").config();
const User = require("./models/userModels");
const Message  = require("./models/Message");
const cron = require("node-cron");
const fs = require("fs");
const path = require('path');
const { sendAllReminders } = require("./scheduler/reminders");

const app = express();
// 🔐 Load SSL certificate
let server;
// ✅ Read USE_HTTPS: Default to true if not set
console.log("🌐 process.env.USE_HTTPS:", process.env.USE_HTTPS);

const USE_HTTPS = (process.env.USE_HTTPS ?? "true").toLowerCase() === "true";
console.log("🌐 USE_HTTPS:", USE_HTTPS);

// 📦 Use HTTPS if USE_HTTPS is true and certs exist
if (USE_HTTPS ) {
const credentials = {
    key: fs.readFileSync(path.join(__dirname, '../cert/private.key'), 'utf8'),
    cert: fs.readFileSync(path.join(__dirname, '../cert/certificate.crt'), 'utf8'),
  };
  
  
   server = https.createServer(credentials, app);
}else{

    server = http.createServer(app);
  console.log("🌐 HTTP server initialized.");

}
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
            // console.log(`🟢 User ${socket.userId} authenticated`);
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
        io.to(receiverSocketId).emit("receiveMessage", { sender, message });
    }

   console.log(`📨 Message sent from ${sender} to ${receiver}`);

    try {
        const receiverUser = await User.findById(receiver);
        const senderUser = await User.findById(sender);

        if (!receiverUser) {
            console.log(`❌ Receiver not found in DB: ${receiver}`);
        } else {
           console.log(`🔍 Receiver: ${receiverUser.username}, Role: ${receiverUser.role}`);
           console.log(`📱 PushToken: ${receiverUser.pushToken}`);
        }
        if (receiverUser?.pushToken) {
          console.log("🔔 Sending push notification...");
            let notificationMessage = "";

            if (receiverUser.role === "doctor") {
                notificationMessage = `You have a new message from ${senderUser.username}`;
            } else if (receiverUser.role === "patient") {
                console.log("doctor sending message")
                notificationMessage = `You have a new message from your doctor`;
            }else {
              notificationMessage = `You have a new message`;
          }
          console.log("🔔 notificationMessage",notificationMessage);
            console.log("doctor sending message122")
            const result = await sendPushNotificationByToken(
                receiverUser.pushToken,
                "New Message",
                notificationMessage
            );

           console.log("📬 Push Ticket Response:", result);
           console.log(`📲 Push notification sent to ${receiverUser.username}`);
        } else {
            console.warn(`⚠️ Push token missing for user ${receiver}`);
        }
    } catch (error) {
      console.error("❌ Error sending push notification:", {
        error: error.message,
        senderId: sender,
        receiverId: receiver,
        socketId: socket.id,
    });
        
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
    
            // console.log(`✅ Messages marked as read: ${senderId} → ${receiverId}`);
    
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
    socket.on("chatClosed", () => {javascript:void(0)
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





      cron.schedule("0 7 * * *",  sendAllReminders, { timezone: "Europe/Istanbul" });
      cron.schedule("0 12 * * *", sendAllReminders, { timezone: "Europe/Istanbul" });
      cron.schedule("0 19 * * *", sendAllReminders, { timezone: "Europe/Istanbul" });


module.exports = { io, app, server };
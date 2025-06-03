/**
 * WebSocket server setup for real-time chat and push notifications.
 * Uses JWT authentication, handles message events, read receipts, and scheduled reminders.
 * 
 * @module socket
 */
const { Server } = require("socket.io");
const https = require("https");
const http = require("http");
const express = require("express");
const jwt = require("jsonwebtoken");
// const {sendPushNotification} = require("./utils/pushNotifications")
const {sendPushNotificationByToken} = require("./notificationService")
require("dotenv").config();
const User = require("../models/userModels");
const Message  = require("../models/Message");
const cron = require("node-cron");
const fs = require("fs");
const path = require('path');
const { sendAllReminders } = require("../scheduler/reminders");
const {getNotificationMessage}=require("./NotificationText")
const verifyWSSocketToken = require("../middlewares/authWSMiddleware");

const app = express();
// 🔐 HTTPS/HTTP server setup based on environment config
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

// Initialize WebSocket server
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "*" },
  });
  
// Map to store online users and their socket IDs
const users = new Map();

// Map to track which users are viewing which chats
const activeChats = new Map(); 

/**
 * WebSocket middleware for JWT authentication.
 * Verifies token and attaches userId to the socket instance.
 */
io.use(verifyWSSocketToken);
/**
 * WebSocket connection handler.
 */
io.on("connection", (socket) => {
    console.log(`🔌 New connection: ${socket.id} (User: ${socket.userId})`);

    // ✅ Store connected user's socket ID
    users.set(socket.userId, socket.id);
/**
   * Handle sending a new message.
   * Emits message to receiver (if online) and sends a push notification.
   */
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
        //    console.log(`🔍 Receiver: ${receiverUser.username}, Role: ${receiverUser.role}`);
        //    console.log(`📱 PushToken: ${receiverUser.pushToken}`);
        }
        if (receiverUser?.pushToken) {
        //   console.log("🔔 Sending push notification...");
            
            //getting notification Text depending on role
            const { notificationMessage, targetScreen, targetParams } = getNotificationMessage(receiverUser, senderUser, sender);
        //   console.log("🔔 notificationMessage",notificationMessage);
            const result = await sendPushNotificationByToken(
                receiverUser.pushToken,
                notificationMessage,
                message,
                targetScreen,
                targetParams

            );

           console.log("📬 Push Ticket Response:", result);
        //    console.log(`📲 Push notification sent to ${receiverUser.username}`);
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
   * Mark messages as read and notify sender.
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
  /**
   * Track when a chat is opened.
   */    socket.on("chatOpened", ({ withUserId }) => {
        activeChats.set(socket.userId, withUserId);
    });
     /**
   * Track when a chat is closed.
   */
    socket.on("chatClosed", () => {javascript:void(0)
        activeChats.delete(socket.userId);
    });
        
    /**
     *  Handle User Disconnect
     */
    socket.on("disconnect", () => {
        console.log(`🔴 User disconnected: ${socket.userId} (Socket: ${socket.id})`);
        users.delete(socket.userId);
    });
    });


    // Schedule reminders at specific times 
      cron.schedule("0 7 * * *",  sendAllReminders, { timezone: "Europe/Istanbul" });
      cron.schedule("0 12 * * *", sendAllReminders, { timezone: "Europe/Istanbul" });
      cron.schedule("0 19 * * *", sendAllReminders, { timezone: "Europe/Istanbul" });


module.exports = { io, app, server };
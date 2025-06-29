/**
 * WebSocket server setup for real-time chat and push notifications.
 * Uses JWT authentication, handles message events, read receipts, and scheduled reminders.
 * 
 * @module socket
 */
const { Server } = require("socket.io");
const express = require("express");
require("dotenv").config();
const cron = require("node-cron");

const User = require("../models/userModels");
const Message = require("../models/Message");
const { sendAllReminders } = require("../scheduler/reminders");
const { getNotificationMessage } = require("./NotificationText");
const { sendPushNotificationByToken } = require("./notificationService");
const verifyWSSocketToken = require("../middlewares/authWSMiddleware");
const { createServer } = require("./serverSetup");

const app = express();
// 🔐 HTTPS/HTTP server setup based on environment config
const server = createServer(app);
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
           console.log(`🔍 Receiver: ${receiverUser.username}, Role: ${receiverUser.role}`);
        //    console.log(`📱 PushToken: ${receiverUser.pushToken}`);
        }
        if (receiverUser?.pushToken) {
        //   console.log("🔔 Sending push notification...");
            
            //getting notification Text depending on role
            const { notificationMessage, targetScreen, targetParams } = getNotificationMessage(receiverUser, senderUser, sender);
          console.log("🔔 notificationMessage",notificationMessage);
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
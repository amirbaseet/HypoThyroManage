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
const MedicineLog = require("./models/MedicineLog"); // Adjust path if needed
const fs = require("fs");
const path = require('path');
const moment = require("moment-timezone");
const {
  weeklyNotificationText,
  dailyNotificationText,
  dayilyRemRemindernotificationText
} = require("./utils/NotificationText"); // adjust path as needed
const {
  getAllUsers,
  getPatientsWithoutLogs,
  getDoctors
} = require("./utils/userNotificationHelper"); // Adjust path if needed

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
    // console.log(`🔌 New connection: ${socket.id} (User: ${socket.userId})`);

    // ✅ Store connected user's socket ID
    users.set(socket.userId, socket.id);

    // socket.on("sendMessage", async ({ sender, receiver, message }, callback) => {
    //     if (!sender || !receiver || !message.trim()) {
    //         return callback({ status: "error", error: "Invalid message data" });
    //     }

    //     const receiverSocketId = users.get(receiver);
    //     const isChatActive = activeChats.get(receiver) === sender;

    //     if (receiverSocketId) {
    //         // ✅ Send message via WebSocket if the user is online
    //         io.to(receiverSocketId).emit("receiveMessage", { sender, message });
    //                 // 🟡 User is online but not viewing the chat → send push notification
    //     if (!isChatActive) {
    //         try {
    //             const receiverUser = await User.findById(receiver);
    //             const senderUser = await User.findById(sender);
    //             if (receiverUser?.pushToken) {
    //                 const notificationMessage =
    //                     receiverUser.role === "doctor"
    //                         ? `You have a new message from ${senderUser.username}`
    //                         : `You have a new message from your doctor`;

    //                 await sendPushNotificationByToken(
    //                     receiverUser.pushToken,
    //                     "New Message",
    //                     notificationMessage
    //                 );
    //             }
    //         } catch (error) {
    //             console.error("❌ Error sending push notification:", error);
    //         }
    //     }

    //     } else {
    //         // ✅ If user is offline, fetch their Expo push token and send a notification
    //         try {
    //             const receiverUser = await User.findById(receiver);
    //             const senderUser = await User.findById(sender);

    //             if (receiverUser?.pushToken) {
    //                 let notificationMessage = "";

    //                 if (receiverUser.role === "doctor") {
    //                     notificationMessage = `You have received a message from ${senderUser.username}`;
    //                 } else if (receiverUser.role === "patient") {
    //                     notificationMessage = `You have received a message from your doctor`;
    //                 }
    
    //                 await sendPushNotificationByToken(
    //                     receiverUser.pushToken,
    //                     "New Message",
    //                     notificationMessage
    //                 );
    //                 }
    //         } catch (error) {
    //             console.error("❌ Error sending push notification:", error);
    //         }
    //     }

    //     callback({ status: "success" });
    // });
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
                notificationMessage = `You have a new message from your doctor`;
            }else {
              notificationMessage = `You have a new message`;
          }
          console.log("🔔 notificationMessage",notificationMessage);

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
// ✅ Helper: Send notification to list of users
const sendNotificationto = async (users, notificationText) => {
  for (const user of users) {
    await sendPushNotificationByToken(
      user.pushToken,
      notificationText.title,
      notificationText.body
    );
  }
};



      const sendAllReminders = async () => {
        const now = moment().tz("Europe/Istanbul");
        const formattedTime = now.format("YYYY-MM-DD HH:mm:ss");
        const dayOfWeek = now.day(); // 0 = Sunday
        const hour = now.hour();     // 0 - 23
      
      
        try {
          const users = await getAllUsers();
          const Doctors = await getDoctors();
          // 7AM Reminder
          if (hour === 7) {
      
            await sendNotificationto(users, dailyNotificationText);
            
            console.log(`🕒 [Reminder Triggered - ${now.format("dddd")} @ ${formattedTime}]`);
            console.log(`✅ Sent ${users.length} 7AM reminders.`);
          }
      
          // 7PM Weekly Reminder (Sun, Wed, Fri)
          if (hour === 19 && [0, 3, 5].includes(dayOfWeek)) {
         
            await sendNotificationto(users, weeklyNotificationText);
            console.log(`🕒 [Reminder Triggered - ${now.format("dddd")} @ ${formattedTime}]`);
            console.log(`✅ Sent ${users.length} 7PM reminders.`);
          }
            
          // 12PM: Check for patients with no medicine logs
          if (hour === 12) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
      
            const patientsWithoutLogs = await getPatientsWithoutLogs(today);
            await sendNotificationto(patientsWithoutLogs, dayilyRemRemindernotificationText);
            await sendNotificationto(Doctors, dayilyRemRemindernotificationText);
            console.log(`🕒 [Reminder Triggered - ${now.format("dddd")} @ ${formattedTime}]`);
            console.log(`[12PM Reminder] ✅ Sent to ${patientsWithoutLogs.length} patients without logs`);
          }
            
        } catch (error) {
          console.error("❌ Error sending reminders:", {
            message: error.message,
            stack: error.stack,
            time: formattedTime,
        });
            }
      };

      cron.schedule("0 7 * * *",  sendAllReminders, { timezone: "Europe/Istanbul" });
      cron.schedule("0 12 * * *", sendAllReminders, { timezone: "Europe/Istanbul" });
      cron.schedule("0 19 * * *", sendAllReminders, { timezone: "Europe/Istanbul" });


module.exports = { io, app, server };
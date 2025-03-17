const express = require("express");
const { Expo } = require("expo-server-sdk");
const User = require("../models/userModels");
const router = express.Router();
const expo = new Expo();
const { sendNotificationToAllUsers } = require("../utils/notificationService");


// Simulating user push tokens (Replace with actual database logic)
const userTokens = {
    "1": "ExponentPushToken[uL-N7yA7-cRx0NVLr6pLji]",  // Example user ID and token
    "2": "ExponentPushToken[2-3VMKFIAiJ9OnthuY4FQV]",  // Example user ID and token
};

router.post("/send", async (req, res) => {
    const { userId, title, message } = req.body;

    // Get the user's push token from the simulated database
    const pushToken = userTokens[userId];

    if (!pushToken) {
        return res.status(404).json({ error: "User push token not found" });
    }

    if (!Expo.isExpoPushToken(pushToken)) {
        return res.status(400).json({ error: "Invalid Expo push token" });
    }

    let messages = [{
        to: pushToken,
        sound: "default",
        title: title,
        body: message,
    }];

    try {
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];

        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }

        return res.status(200).json({ message: "Notification sent!", tickets });
    } catch (error) {
        return res.status(500).json({ error: "Failed to send notification", details: error });
    }
});
// ✅ Admin sends notifications to all users
router.post("/send-to-all", async (req, res) => {
    try {
        const { adminId, title, message } = req.body;

        // ✅ Check if the admin exists
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized: Only admins can send notifications." });
        }

        // ✅ Send notifications
        await sendNotificationToAllUsers(title, message);

        res.status(200).json({ message: "Notifications sent successfully to all users." });
    } catch (error) {
        console.error("❌ Error sending notification to all users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




module.exports = router;

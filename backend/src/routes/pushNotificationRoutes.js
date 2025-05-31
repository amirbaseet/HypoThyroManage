const express = require("express");
const { Expo } = require("expo-server-sdk");
const router = express.Router();
const expo = new Expo();
const notificationController = require("../controllers/notificationController");
const verifyToken = require("../middlewares/authMiddleware")
const authorizeRoles = require("../middlewares/roleMiddleware")


// Simulating user push tokens (Replace with actual database logic)
const userTokens = {
    "1": "ExponentPushToken[uL-N7yA7-cRx0NVLr6pLji]",  // Example user ID and token
    "2": "ExponentPushToken[2-3VMKFIAiJ9OnthuY4FQV]",  // Example user ID and token
    "3": "ExponentPushToken[UsYdgFB8Y5v5AArRcWTn9k]",  // Example user ID and token
};
/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Manage push notifications
 */

/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Send a push notification to a specific user (test endpoint)
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The user's ID
 *               title:
 *                 type: string
 *                 description: Notification title
 *               message:
 *                 type: string
 *                 description: Notification body
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       400:
 *         description: Invalid Expo push token
 *       404:
 *         description: User push token not found
 *       500:
 *         description: Failed to send notification
 */
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
/**
 * @swagger
 * /api/notifications/send-to-all:
 *   post:
 *     summary: Send a push notification to all users (admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Notification title
 *               message:
 *                 type: string
 *                 description: Notification body
 *     responses:
 *       200:
 *         description: Notifications sent successfully to all users
 *       500:
 *         description: Internal server error
 */
// ✅ Admin sends notifications to all users
router.post("/send-to-all",verifyToken,authorizeRoles("admin"), notificationController.sendNotificationToAll);




module.exports = router;

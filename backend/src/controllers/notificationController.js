
/**
 * Notification Controller
 * 
 * Handles sending push notifications to all users.
 * 
 * Functions:
 * - sendNotificationToAll: Admin-only endpoint to broadcast notifications.
 */
const User = require("../models/userModels");

const { sendNotificationToAllUsers } = require("../utils/notificationService");
/**
 * Admin-only: Send a push notification to all users.
 * 
 * Expected Request Body:
 * - {string} title: The title of the notification.
 * - {string} message: The message body of the notification.
 * - {string|null} [screen]: Optional. The screen name to navigate users to when they tap the notification.
 * - {Object|null} [params]: Optional. Additional parameters to pass with the navigation.
 * 
 * @param {Object} req - Express request object.
 *   @param {Object} req.body - Request body containing notification details.
 *   @param {string} req.body.title - Notification title.
 *   @param {string} req.body.message - Notification body.
 *   @param {string|null} [req.body.screen] - Optional. Target screen name for navigation.
 *   @param {Object|null} [req.body.params] - Optional. Additional navigation parameters.
 * @param {Object} res - Express response object.
 * 
 * @returns {Object} JSON response with success message or error.
 * 
 * @example
 * POST /api/notifications/send-to-all
 * {
 *   "title": "Reminder",
 *   "message": "Don't forget your appointment tomorrow!",
 *   "screen": "AppointmentDetails",
 *   "params": { "id": "abc123" }
 * }
 */
exports.sendNotificationToAll = async (req, res) => {
    try {
        const { title, message, screen, params } = req.body;
        await sendNotificationToAllUsers(title, message, screen, params);

        res.status(200).json({ message: "Notifications sent successfully to all users." });
    } catch (error) {
        console.error("❌ Error sending notification to all users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

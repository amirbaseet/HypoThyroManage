/**
 * Notification Service Module
 * Handles sending push notifications to users via Expo.
 * 
 * Functions:
 * - sendPushNotification: Send a notification to a specific user by userId.
 * - sendNotificationToAllUsers: Send a notification to all users (admin function).
 * - sendPushNotificationByToken: Send a notification by Expo Push Token.
 * - sendNotificationto: Send a notification to a list of users.
 */
const { Expo } = require("expo-server-sdk");
const User = require("../models/userModels");

const expo = new Expo();

/**
 * Send a push notification to a specific user by their userId.
 * 
 * @param {string} userId - The user's database ID.
 * @param {string} title - The notification title.
 * @param {string} message - The notification message body.
 * @param {string|null} [screen=null] - The screen to navigate to on click (optional).
 * @param {Object|null} [params=null] - Additional navigation parameters (optional).
 * @returns {Promise<void>}
 */
exports.sendPushNotification = async (userId, title, message, screen = null, params = null) => {
    try {
        const user = await User.findById(userId);

        if (!user || !user.pushToken) {
            console.log("❌ User not found or push token missing.");
            return;
        }

        if (!Expo.isExpoPushToken(user.pushToken)) {
            console.log("❌ Invalid Expo Push Token.");
            return;
        }

        const messages = [
            {
                to: user.pushToken,
                sound: "default",
                title,
                body: message,
                data: { screen, params },
            },
        ];

        let chunks = expo.chunkPushNotifications(messages);
        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log("✅ Push notification response:", ticketChunk);
        }

        console.log(`✅ Notification sent to ${user.username}`);
    } catch (error) {
        console.error("❌ Error sending push notification:", error);
    }
};

/**
 * Send a push notification to all users who have a registered push token.
 * Typically used by admin features.
 * 
 * @param {string} title - The notification title.
 * @param {string} message - The notification body.
 * @param {string|null} [screen=null] - Optional navigation target screen.
 * @param {Object|null} [params=null] - Optional navigation parameters.
 * @returns {Promise<Array>} Array of Expo ticket responses.
 */
exports.sendNotificationToAllUsers = async (title, message, screen = null, params = null) => {
    try {
        const users = await User.find({ pushToken: { $exists: true } });

        const messages = users.map(user => ({
            to: user.pushToken,
            sound: "default",
            title,
            body: message,
            data: { screen, params },
        }));

        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];

        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }

        console.log(`✅ Notifications sent to ${users.length} users.`);
        return tickets;
    } catch (error) {
        console.error("❌ Error sending notifications to all users:", error);
        throw error;
    }
};

/**
 * Send a push notification directly to a device using its Expo push token.
 * 
 * @param {string} pushToken - The Expo push token.
 * @param {string} title - The notification title.
 * @param {string} message - The notification body.
 * @param {string|null} [screen=null] - Optional navigation target screen.
 * @param {Object|null} [params=null] - Optional navigation parameters.
 * @returns {Promise<Array|Object>} Array of Expo ticket responses or error object.
 */
exports.sendPushNotificationByToken = async (pushToken, title, message, screen = null, params = null) => {
    try {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.log("❌ Invalid Expo Push Token:", pushToken);
            return;
        }

        const messages = [
            {
                to: pushToken,
                sound: "default",
                title,
                body: message,
                data: { screen, params },
            },
        ];

        let chunks = expo.chunkPushNotifications(messages);
        let allTickets = []; // ✅ To collect all responses

        for (let chunk of chunks) {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            allTickets.push(...ticketChunk);

            for (let ticket of ticketChunk) {
                if (ticket.status === "error") {
                    console.warn("⚠️ Push Error:", ticket.message);
                    if (ticket.details?.error) {
                        console.warn("🔍 Details:", ticket.details.error);
                    }
                }
            }
        }

        // console.log(`✅ Push notification sent to token: ${pushToken}`);
        return allTickets; // ✅ Return the tickets array
    } catch (error) {
        console.error("❌ Error sending push notification by token:", error);
        return { error: error.message };

    }
};

/**
 * Helper function to send a notification to a list of users.
 * 
 * @param {Array} users - Array of user objects (must include pushToken property).
 * @param {Object} notificationText - Object containing title and body of the notification.
 * @param {string|null} [screen=null] - Optional navigation screen.
 * @param {Object|null} [params=null] - Optional navigation parameters.
 * @returns {Promise<void>}
 */
exports.sendNotificationto = async (users, notificationText, screen = null, params = null) => {
    for (const user of users) {
        await this.sendPushNotificationByToken(
            user.pushToken,
            notificationText.title,
            notificationText.body,
            screen,
            params
        );
    }
};

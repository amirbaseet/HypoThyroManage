const { Expo } = require("expo-server-sdk");
const User = require("../models/userModels");

const expo = new Expo();

// ✅ Send push notification to a specific user by userId
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

// ✅ Send push notification to all users (Admin function)
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

// ✅ Send push notification by Expo Push Token directly
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

        console.log(`✅ Push notification sent to token: ${pushToken}`);
        return allTickets; // ✅ Return the tickets array
    } catch (error) {
        console.error("❌ Error sending push notification by token:", error);
        return { error: error.message };

    }
};

// ✅ Helper: Send notification to a list of users (array of user objects)
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

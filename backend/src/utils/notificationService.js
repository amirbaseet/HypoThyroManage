const { Expo } = require("expo-server-sdk");
const User = require("../models/userModels");

const expo = new Expo();

exports.sendPushNotification = async (userId, title, message) => {
    try {
        const user = await User.findById(userId);

        if (!user || !user.pushToken) {
            console.log("User not found or push token missing.");
            return;
        }

        // ✅ Corrected: Use `Expo.isExpoPushToken()` instead of `expo.isExpoPushToken()`
        if (!Expo.isExpoPushToken(user.pushToken)) {
            console.log("Invalid Expo Push Token.");
            return;
        }

        const messages = [
            {
                to: user.pushToken,
                sound: "default",
                title: title,
                body: message,
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
exports.sendNotificationToAllUsers = async (title, message) =>{
    try {
        const users = await User.find({ role: "patient", pushToken: { $ne: null } });

        if (users.length === 0) {
            console.log("No users found with push tokens.");
            return;
        }

        let messages = users.map((user) => ({
            to: user.pushToken,
            sound: "default",
            title: title,
            body: message,
        }));

        let chunks = expo.chunkPushNotifications(messages);

        for (let chunk of chunks) {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log("📬 Batch Ticket Response:", ticketChunk);
        
            for (let ticket of ticketChunk) {
                if (ticket.status === "error") {
                    console.warn("⚠️ Push Error:", ticket.message);
                    if (ticket.details?.error) {
                        console.warn("🔍 Details:", ticket.details.error);
                    }
                }
            }
        }
        
        console.log(`✅ Notification sent to ${users.length} users.`);
    } catch (error) {
        console.error("❌ Error sending notifications to all users:", error);
    }
};
exports.sendPushNotificationByToken = async (pushToken, title, message) => {
    try {
        // ✅ Check if the token is valid
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
                data: { customData: "example" }, // Optional custom data
            },
        ];

        const chunks = expo.chunkPushNotifications(messages);

        for (let chunk of chunks) {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          //  console.log("📬 Push Ticket Response:", ticketChunk);

            // Check for errors in the ticket
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
    } catch (error) {
        console.error("❌ Error sending push notification:", error);
    }
};


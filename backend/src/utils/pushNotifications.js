const fetch = require("node-fetch");

const EXPO_PUSH_SERVER_URL = "https://exp.host/--/api/v2/push/send";

/**
 * Sends a push notification to a user
 * @param {string} expoPushToken - The recipient's Expo push token
 * @param {string} messageTitle - The title of the notification
 * @param {string} messageBody - The body content of the notification
 */
const sendPushNotification = async (expoPushToken, messageTitle, messageBody) => {
    if (!expoPushToken) {
        console.log("🚨 Expo Push Token is missing!");
        return;
    }

    const message = {
        to: expoPushToken,
        sound: "default",
        title: messageTitle,
        body: messageBody,
        data: { type: "new_message" },
    };

    try {
        const response = await fetch(EXPO_PUSH_SERVER_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-Encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });

        const responseData = await response.json();
        console.log("✅ Push notification sent successfully:", responseData);
    } catch (error) {
        console.error("❌ Error sending push notification:", error);
    }
};

module.exports = { sendPushNotification };

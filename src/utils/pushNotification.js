import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Alert, Platform } from "react-native";
import i18n from "../i18n"; // Adjust the path based on your setup
import * as Localization from "expo-localization";

/**
 * Registers the device for push notifications
 */
export const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            Alert.alert("Failed to get push token for push notification!");
            return null;
        }

        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Expo Push Token:", token);
    } else {
        Alert.alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    return token;
};

/**
 * Cancels all existing notifications before scheduling a new one
 */
export const scheduleDailyNotification = async () => {
    console.log("🔍 Checking for existing notifications...");

    // Get all scheduled notifications
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    if (scheduledNotifications.length > 0) {
        console.log("⚠️ Notification already scheduled. Skipping...");
        return;
    }

    console.log("🗑️ No existing notifications found. Scheduling a new one...");

    await Notifications.scheduleNotificationAsync({
        content: {
            title: i18n.t("morning_reminder_title"),
            body: i18n.t("morning_reminder_body"),
            sound: "default",
        },
        trigger: {
            hour: 7, // Set to 7 AM
            minute: 0,
            repeats: true, // Ensures it repeats every day
            timezone: Localization.timezone || 'local',
        },
    });

    console.log("✅ Daily notification scheduled at 07:00.");
};

/**
 * Send a test notification manually
 */
export const sendTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: i18n.t("test_notification_title"),
            body: i18n.t("test_notification_body"),
            sound: "default",
        },
                trigger: { seconds: 5 }, // Triggers after 5 seconds
    });

    console.log("📩 Test notification sent successfully!");
};

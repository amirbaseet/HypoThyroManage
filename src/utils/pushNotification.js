const Constants = require("expo-constants");
const Notifications = require("expo-notifications");
const { Platform, Alert } = require("react-native");

// ❌ Removed environment file import
// const getEnvVars = require("../../environment");
// const { EXPO_PUSH_SERVER_URL } = getEnvVars(); // Removed

const ip = "10.7.84.67";  // ✅ Replace with your actual local network IP
const EXPO_PUSH_SERVER_URL = `http://${ip}:3001/api/notifications/send`;  // ✅ Use local backend

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Registers the device for push notifications
 */
const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.default.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);  // ✅ Logs the token in the console

  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

/**
 * Sends a push notification
 */
const sendPushNotification = async (expoPushToken, messageTitle = "", messageBody = "") => {
  if (!expoPushToken) {
    console.log("Expo Push Token is missing!");
    return;
  }

  // ❌ Removed environment-based URL handling
  if (!EXPO_PUSH_SERVER_URL) {
    console.log("Push Notification Server URL is missing!");
    return;
  }

  const message = {
    to: expoPushToken,
    sound: "default",
    title: messageTitle,
    body: messageBody,
    data: { someData: "goes here" },
  };

  try {
    await fetch(EXPO_PUSH_SERVER_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    console.log("Push notification sent successfully.");
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};

/**
 * Schedules a fixed daily notification at 6 AM
 */
const scheduleDailyNotification = async () => {
  console.log("🔍 Checking existing notifications...");

  // ✅ Check if a notification is already scheduled
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  if (scheduledNotifications.length > 0) {
    console.log("⚠️ Notification already scheduled, skipping...");
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Good Morning!",
      body: "Don't forget to check your schedule today!",
      sound: "default",
    },
    trigger: {
      hour: 6,    // ✅ 24-hour format (6 PM)
      minute: 0,   // ✅ Minute
      second: 0,   // ✅ Ensures it does not trigger immediately
      repeats: true,
    },
  });

  console.log("✅ Daily notification scheduled at 09:00.");
};

/**
 * Export all functions
 */
module.exports = {
  registerForPushNotificationsAsync,
  sendPushNotification,
  scheduleDailyNotification,
};

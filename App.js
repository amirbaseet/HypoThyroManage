import React, { useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { AuthContext, AuthProvider } from "./src/context/AuthContext";
import { initializeDatabase } from "./src/database/database";

// ✅ Import push notification functions
const {
    registerForPushNotificationsAsync,
    scheduleDailyNotification,
} = require("./src/utils/pushNotification");

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const setupNotifications = async () => {
            console.log("🔔 Checking if notification is already scheduled...");
            const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
            
            if (scheduledNotifications.length === 0) {
                console.log("✅ No existing notifications. Scheduling now...");
                await scheduleDailyNotification();
            } else {
                console.log("⚠️ Notification already scheduled. Skipping.");
            }
        };

        setupNotifications();
    }, []);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <Stack.Screen name="Home" component={DrawerNavigator} />
            ) : (
                <Stack.Screen name="Login" component={LoginScreen} />
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    useEffect(() => {
        const initializeApp = async () => {
            console.log("🚀 Initializing app...");
            
            // ✅ Initialize database
            initializeDatabase();

            // ✅ Register for push notifications (only runs once)
            await registerForPushNotificationsAsync();
        };

        initializeApp();
    }, []);

    return (
        <AuthProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}

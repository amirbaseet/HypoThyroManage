import React, { useState,useContext, useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { AuthContext, AuthProvider } from "./src/context/AuthContext";
import * as Notifications from "expo-notifications";
import AppLoading from 'expo-app-loading';
import PatientTabs from "./src/navigation/PatientTabs";
import DoctorTabs from "./src/navigation/DoctorTabs"; 
import PatientDrawerNavigator from "./src/navigation/PatientDrawerNavigator"; // 👈 New import
import GreetingScreen from "./src/screens/GreetingScreen"; // 👈 Add this line
import * as Font from 'expo-font';

// ✅ Import push notification functions
import {
    registerForPushNotificationsAsync,
    scheduleDailyNotification,
} from "./src/utils/pushNotification";
// ✅ Import i18n and translation provider
import i18n from "./src/i18n";
import { I18nextProvider } from "react-i18next";

const Stack = createStackNavigator();
const fetchFonts = () => {
    return Font.loadAsync({
      'LibreBaskerville-Regular': require('./assets/fonts/LibreBaskerville-Regular.ttf'),
      'SourceSans3-Regular': require('./assets/fonts/SourceSans3-Regular.ttf'),
    });
  };
  
const AppNavigator = () => {
    const { user } = useContext(AuthContext);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        // ✅ Listen for notifications when app is in foreground
        notificationListener.current =
            Notifications.addNotificationReceivedListener(notification => {
                console.log("📩 Notification Received:", notification);
            });

        // ✅ Handle notification interactions
        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(response => {
                console.log("🔔 Notification Clicked:", response);
            });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
{user ? (
    <>
        <Stack.Screen name="Greeting" component={GreetingScreen} />
        <Stack.Screen name="PatientDrawer" component={PatientDrawerNavigator} />
        <Stack.Screen name="DoctorTabs" component={DoctorTabs} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
    </>
) : (
    <>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </>
)}
        </Stack.Navigator>
    );
};

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const initializeApp = async () => {
            console.log("🚀 Initializing app...");

            // ✅ Register for push notifications
            await registerForPushNotificationsAsync();

            // ✅ Schedule daily notification
            await scheduleDailyNotification();
        };

        initializeApp();
    }, []);
    if (!fontsLoaded) {
        return (
          <AppLoading
            startAsync={fetchFonts}
            onFinish={() => setFontsLoaded(true)}
            onError={console.warn}
          />
        );
      }
    
    return (
        <AuthProvider>
            <I18nextProvider i18n={i18n}>
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
            </I18nextProvider>
        </AuthProvider>
    );
}

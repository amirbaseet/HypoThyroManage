import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";

import PatientStack from "./PatientStack"; // ✅ Use the full stack
import PatientChatScreen from "../screens/PatientChatScreen ";
import ReportsStack from "./ReportsStack";
import PatientHomeScreen from '../screens/PatientHomeScreen';
import HakkimizdaScreen from '../screens/HakkimizdaScreen';
import useUnreadMessages from "../hooks/useUnreadMessages";

const Drawer = createDrawerNavigator();

const PatientDrawerNavigator = () => {
    const { user, logout } = useContext(AuthContext);
    const { t } = useTranslation();
    const unreadCount = useUnreadMessages(user?.id);

    return (
        <Drawer.Navigator
            screenOptions={{
                headerRight: () => (
                    <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                        <Text style={{ color: "red", fontSize: 16 }}>{t("logout")}</Text>
                    </TouchableOpacity>
                ),
            }}
        >
            <Drawer.Screen
                name="PatientHomeScreen"
                component={PatientHomeScreen} // ✅ Use the stack that includes PatientVideosScreen + others
                options={{
                    title: t("home"), // Optional: change this to whatever label you want
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="PatientChat"
                component={PatientChatScreen}
                options={{
                    title: t("chat"),
                    drawerIcon: ({ color, size }) => (
                        <View>
                            <Ionicons name="chatbubble-outline" size={size} color={color} />
                            {unreadCount > 0 && (
                                <View
                                    style={{
                                        position: "absolute",
                                        top: -2,
                                        right: -6,
                                        backgroundColor: "red",
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                    }}
                                />
                            )}
                        </View>
                    ),
                }}
            />

            <Drawer.Screen
                name="Reports"
                component={ReportsStack}
                options={{
                    title: t("Tabreports"),
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="document-text-outline" size={size} color={color} />
                    ),
                    drawerItemStyle: { display: 'none' }, // 👈 hides it from the drawer menu

                }}
            />

<Drawer.Screen
    name="Hakkimizda"
    component={HakkimizdaScreen}
    options={{
        title: t('about_us'),
        drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
        ),
    }}
/>
<Drawer.Screen
    name="Patient"
    component={PatientStack}
    options={{
        title: t("videos"), // or "Hasta Tavsiyeleri"
        drawerItemStyle: { display: 'none' }, // 👈 hides it from the drawer menu
    }}
/>
        </Drawer.Navigator>
        
    );
};

export default PatientDrawerNavigator;

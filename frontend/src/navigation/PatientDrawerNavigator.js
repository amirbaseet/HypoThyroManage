import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { AuthContext } from "context/AuthContext";

import PatientHomeStack from "./PatientHomeStack"; // ✅ Use the full stack
import PatientChatScreen from "screens/PatientChatScreen ";
import HakkimizdaScreen from 'screens/patient/HakkimizdaScreen';
import useUnreadMessages from "hooks/useUnreadMessages";
import SymptomTableScreen from "screens/SymptomTableScreen";
import KullanimRehberiScreen from 'screens/patient/KullanimRehberiScreen';

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
  name="PatientHomeStack"
  component={PatientHomeStack}
  options={{
    title: t("home"),
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
    name="SymptomTable"
    component={SymptomTableScreen}
    options={{
        title: t('Tavsiye_İlgili_Semptomlar'),
        drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
        ),
    }}
/>
<Drawer.Screen
  name="KullanimRehberi"
  component={KullanimRehberiScreen}
  options={{
    title: t('kullanim_rehberi'),
    drawerIcon: ({ color, size }) => (
      <Ionicons name="book-outline" size={size} color={color} />
    ),
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


        </Drawer.Navigator>
        
    );
};

export default PatientDrawerNavigator;

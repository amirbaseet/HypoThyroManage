// navigation/DrawerNavigator.js (Cleaned Up)
import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Text, TouchableOpacity } from "react-native";
import { AuthContext } from "context/AuthContext";
import { useTranslation } from "react-i18next";

import HomeScreen from 'screens/HomeScreen';
import AdminDashboardScreen from "screens/AdminDashboardScreen";
import CreateFormWindowScreen from "screens/CreateFormWindowScreen";
import ManageFormWindowsScreen from "screens/ManageFormWindowsScreen";
import AdminResetPasswordScreen from "screens/AdminResetPasswordScreen";
import PatientStack from './PatientStack'; // instead of only importing PatientVideosScreen

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const { user, logout } = useContext(AuthContext);
    const { t } = useTranslation();

    return (
        <Drawer.Navigator
            screenOptions={{
                headerRight: () => (
                    <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                        <Text style={{ color: "red", fontSize: 16 }}>{t('logout')}</Text>
                    </TouchableOpacity>
                ),
            }}
        >
            <Drawer.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: t('home') }} 
            />

            {user?.role === "admin" && (
                <>
                    <Drawer.Screen 
                        name="AdminDashboard" 
                        component={AdminDashboardScreen} 
                        options={{ title: t('admin_dashboard') }} 
                    />
                    <Drawer.Screen 
                        name="CreateFormWindow" 
                        component={CreateFormWindowScreen} 
                        options={{ title: t('create_form_window') }} 
                    />
                    <Drawer.Screen 
                        name="ManageFormWindows" 
                        component={ManageFormWindowsScreen} 
                        options={{ title: t('manage_form_windows') }} 
                    />
                    <Drawer.Screen 
                        name="AdminResetPassword" 
                        component={AdminResetPasswordScreen} 
                        options={{ title: t('reset_password_screen') }} 
                    />
                </>
            )}

        </Drawer.Navigator>
    );
};

export default DrawerNavigator;

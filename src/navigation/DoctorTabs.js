// navigation/DoctorTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import DoctorDashboardScreen from 'screens/DoctorDashboardScreen';
import DoctorChatStack from './DoctorChatStack'; 
import HomeScreen from 'screens/HomeScreen';

const Tab = createBottomTabNavigator();

const DoctorTabs = () => {
    const { t } = useTranslation();

    return (
        <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          
            <Tab.Screen
                name="DoctorChat"
                component={DoctorChatStack}
                options={{
                    title: t('chat'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles-outline" size={size} color={color} />
                    ),
                }}
            />
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: t('home'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="DoctorReports"
                component={DoctorDashboardScreen}
                options={{
                    title: t('reports'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default DoctorTabs;

// navigation/PatientTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import PatientStack from './PatientStack';
import ReportsStack from './ReportsStack';
import PatientChatScreen from '../screens/PatientChatScreen ';

const Tab = createBottomTabNavigator();

const PatientTabs = () => {
    const { t } = useTranslation();

    return (
        <Tab.Navigator initialRouteName="Home">
                        <Tab.Screen
                name="Chat"
                component={PatientChatScreen}
                options={{
                    title: t('chat'),
                    tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color={color} />,
                }}
            />

            <Tab.Screen
                name="Home"
                component={PatientStack}
                options={{
                    title: t('patient_menu'),
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="ReportsStack"
                component={ReportsStack}
                options={{
                    title: t('Tabreports'),
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
};

export default PatientTabs;

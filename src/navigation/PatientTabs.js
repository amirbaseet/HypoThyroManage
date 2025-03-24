// navigation/PatientTabs.js
import React,{useContext} from 'react';
import {
    View,
} from "react-native";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import useUnreadMessages from '../hooks/useUnreadMessages';
import PatientStack from './PatientStack';
import ReportsStack from './ReportsStack';
import PatientChatScreen from '../screens/PatientChatScreen ';

import { AuthContext } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

const PatientTabs = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const unreadCount = useUnreadMessages(user?.id);
  
    return (
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen
          name="Chat"
          component={PatientChatScreen}
          options={{
            title: t('chat'),
            tabBarIcon: ({ color, size }) => (
              <View>
                <Ionicons name="chatbubble-outline" size={size} color={color} />
                {unreadCount > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -6,
                      backgroundColor: 'red',
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
  
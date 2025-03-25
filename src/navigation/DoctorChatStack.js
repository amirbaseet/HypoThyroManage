import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import DoctorChatListScreen from "../screens/DoctorChatListScreen";
import DoctorChatScreen from "../screens/DoctorChatScreen";
import DoctorDashboardScreen from "../screens/DoctorDashboardScreen";

const Stack = createStackNavigator();

const DoctorChatStack = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ChatList" 
        component={DoctorChatListScreen}
        options={{
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.openDrawer()} 
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="menu" size={28} color="#FFF" />
            </TouchableOpacity>
          ),
          title: t('chat_list_title'), // ✅ localized title
        }}
      />

      <Stack.Screen 
        name="DoctorChatScreen" 
        component={DoctorChatScreen} 
        options={({ route }) => ({
          title: route.params?.patientName || t('chat'), // fallback to translation if no name
        })}
      />

      <Stack.Screen 
        name="DoctorDashboardPopup" 
        component={DoctorDashboardScreen}
        options={{
          presentation: "modal",
          headerShown: true,
          title: t("patient_details"),
        }}
      />
    </Stack.Navigator>
  );
};

export default DoctorChatStack;

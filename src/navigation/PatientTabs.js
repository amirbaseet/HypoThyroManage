// navigation/PatientTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons'; // Optional for icons

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/profileScreen';
import NutritionScreen from '../screens/NutritionScreen';
import ExerciseScreen from '../screens/ExerciseScreen';
import StressScreen from '../screens/StressScreen';
import DermatologicalScreen from '../screens/DermatologicalScreen';
import BrainScreen from '../screens/BrainScreen';
import ReportScreen from "../screens/ReportScreen";
import ReportsScreen from "../screens/ReportsScreen";
import DoctorDashboardScreen from "../screens/DoctorDashboardScreen";
// import RegisterScreen from '../screens/RegisterScreen';
import PatientChatScreen from "../screens/PatientChatScreen ";
import DoctorChatScreen from "../screens/DoctorChatScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import DoctorChatListScreen from "../screens/DoctorChatListScreen";
import DoctorChatStack from "./DoctorChatStack";  // Import the chat stack
import AvailableFormsScreen from "../screens/AvailableFormsScreen";  // Import the chat stack
import CreateFormWindowScreen from "../screens/CreateFormWindowScreen";  // Import the chat stack
import ManageFormWindowsScreen from "../screens/ManageFormWindowsScreen";  // Import the chat stack
import SubmissionHistoryScreen from "../screens/SubmissionHistoryScreen";  // Import the chat stack
import SymptomFormScreen from "../screens/SymptomFormScreen";  // Import the chat stack
import DoctorSubmissionsScreen from "../screens/DoctorSubmissionsScreen";  // Import the chat stack
// in DrawerNavigator.js
import TakeMedicineScreen from "../screens/TakeMedicineScreen";
import ProgressScreen from "../screens/ProgressScreen";
import LearningStack from "./LearningStack"
const Tab = createBottomTabNavigator();

const PatientTabs = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Medicine':
            iconName = 'medkit';
            break;
          case 'Reports':
            iconName = 'document-text';
            break;
          case 'Chat':
            iconName = 'chatbubble';
            break;
          case 'Learning':
            iconName = 'book';
            break;
          default:
            iconName = 'ellipse';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}>
      <Tab.Screen name="Medicine" component={TakeMedicineScreen} />
      <Tab.Screen name="Forms" component={AvailableFormsScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="PastReports" component={ReportsScreen} />
      <Tab.Screen name="Chat" component={PatientChatScreen} />
      <Tab.Screen 
        name="Learning" 
        component={LearningStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default PatientTabs;

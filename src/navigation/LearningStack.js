// navigation/LearningStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

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

const Stack = createStackNavigator();

const LearningStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Nutrition" component={NutritionScreen} />
    <Stack.Screen name="Exercise" component={ExerciseScreen} />
    <Stack.Screen name="Stress" component={StressScreen} />
    <Stack.Screen name="Dermatological" component={DermatologicalScreen} />
    <Stack.Screen name="Brain" component={BrainScreen} />
  </Stack.Navigator>
);

export default LearningStack;

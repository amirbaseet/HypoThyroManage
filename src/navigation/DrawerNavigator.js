import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {  Text, TouchableOpacity } from "react-native";

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
import PatientStack from "./PatientStack"; // import it
import TakeMedicineScreen from "../screens/TakeMedicineScreen";
import ProgressScreen from "../screens/ProgressScreen";
import DoctorPatientsProgressScreen from "../screens/DoctorPatientsProgressScreen";




import { AuthContext } from "../context/AuthContext";

const Drawer = createDrawerNavigator();

// LogoutScreen Component: Handles User Logout

const DrawerNavigator = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <Drawer.Navigator screenOptions={() => ({
            headerRight: () => (
                <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                    <Text style={{ color: "red", fontSize: 16 }}>Logout</Text>
                </TouchableOpacity>
            ),
        })}>

            <Drawer.Screen name="Home" component={HomeScreen} />

            {user?.role === "admin" && (
               <><Drawer.Screen name="AdminDashboard" component={AdminDashboardScreen} />
                <Drawer.Screen name="CreateFormWindow" component={CreateFormWindowScreen} />
                <Drawer.Screen name="ManageFormWindows" component={ManageFormWindowsScreen} />
                </> 
            )}

            {user?.role === "doctor" && (
                <>
                    <Drawer.Screen name="Chat" component={DoctorChatStack} /> 
                    <Drawer.Screen name="Dashboard" component={DoctorDashboardScreen} />
                    <Drawer.Screen name="DoctorSubmissions" component={DoctorSubmissionsScreen} />
                    <Drawer.Screen name="DoctorPatientsProgressScreen" component={DoctorPatientsProgressScreen} />

                </>
            )}

            {user?.role === "patient" && (
                <>
                    <Drawer.Screen name="ProgressScreen" component={ProgressScreen} />
                    <Drawer.Screen name="TakeMedicineScreen" component={TakeMedicineScreen} />
                    <Drawer.Screen name="AvailableForms" component={AvailableFormsScreen} />
                    <Drawer.Screen name="SubmissionHistory" component={SubmissionHistoryScreen} />
                    <Drawer.Screen name="SymptomForm" component={SymptomFormScreen} 
                                   options={{ drawerItemStyle: { display: 'none' } }}
                    />
                    <Drawer.Screen name="Report" component={ReportScreen} />
                    <Drawer.Screen name="Reports" component={ReportsScreen} />
                    <Drawer.Screen name="Chat" component={PatientChatScreen} />
                    <Drawer.Screen name="Nutrition" component={NutritionScreen} />
                    <Drawer.Screen name="Exercise" component={ExerciseScreen} />
                    <Drawer.Screen name="Stress" component={StressScreen} />
                    <Drawer.Screen name="Dermatological" component={DermatologicalScreen} />
                    <Drawer.Screen name="Brain" component={BrainScreen} />
                </>
            )}
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;

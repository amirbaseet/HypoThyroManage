import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Text, TouchableOpacity } from "react-native";

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
import PatientChatScreen from "../screens/PatientChatScreen ";
import DoctorChatStack from "./DoctorChatStack";
import DoctorChatScreen from "../screens/DoctorChatScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import DoctorChatListScreen from "../screens/DoctorChatListScreen";
import AvailableFormsScreen from "../screens/AvailableFormsScreen";
import CreateFormWindowScreen from "../screens/CreateFormWindowScreen";
import ManageFormWindowsScreen from "../screens/ManageFormWindowsScreen";
import SubmissionHistoryScreen from "../screens/SubmissionHistoryScreen";
import SymptomFormScreen from "../screens/SymptomFormScreen";
import DoctorSubmissionsScreen from "../screens/DoctorSubmissionsScreen";
import TakeMedicineScreen from "../screens/TakeMedicineScreen";
import ProgressScreen from "../screens/ProgressScreen";
import DoctorPatientsProgressScreen from "../screens/DoctorPatientsProgressScreen";
import CombinedReportsScreen  from "../screens/CombinedReportsScreen";

import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const { user, logout } = useContext(AuthContext);
    const { t } = useTranslation();

    return (
        <Drawer.Navigator
            screenOptions={() => ({
                headerRight: () => (
                    <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                        <Text style={{ color: "red", fontSize: 16 }}>{t('logout')}</Text>
                    </TouchableOpacity>
                ),
            })}
        >
            <Drawer.Screen name="Home" component={HomeScreen} options={{ title: t('home') }} />

            {user?.role === "admin" && (
                <>
                    <Drawer.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: t('admin_dashboard') }} />
                    <Drawer.Screen name="CreateFormWindow" component={CreateFormWindowScreen} options={{ title: t('create_form_window') }} />
                    <Drawer.Screen name="ManageFormWindows" component={ManageFormWindowsScreen} options={{ title: t('manage_form_windows') }} />
                </>
            )}

            {user?.role === "doctor" && (
                <>
                    <Drawer.Screen name="Chat" component={DoctorChatStack} options={{ title: t('chat') }} />
                    <Drawer.Screen name="Dashboard" component={DoctorDashboardScreen} options={{ title: t('dashboard') }} />
                    <Drawer.Screen name="DoctorSubmissions" component={DoctorSubmissionsScreen} options={{ title: t('submissions') }} />
                    <Drawer.Screen name="DoctorPatientsProgressScreen" component={DoctorPatientsProgressScreen} options={{ title: t('patients_progress') }} />
                </>
            )}

            {user?.role === "patient" && (
                <>
                    <Drawer.Screen name="CombinedReportsScreen" component={CombinedReportsScreen } options={{ title: t('reports') }} />
                    {/* <Drawer.Screen name="ProgressScreen" component={ProgressScreen} options={{ title: t('progress') }} /> */}
                    <Drawer.Screen name="TakeMedicineScreen" component={TakeMedicineScreen} options={{ title: t('take_medicine') }} />
                    <Drawer.Screen name="AvailableForms" component={AvailableFormsScreen} options={{ title: t('available_forms') }} />
                    {/* <Drawer.Screen name="SubmissionHistory" component={SubmissionHistoryScreen} options={{ title: t('submission_history') }} /> */}
                    <Drawer.Screen name="SymptomForm" component={SymptomFormScreen} options={{ drawerItemStyle: { display: 'none' } }} />
                    <Drawer.Screen name="Report" component={ReportScreen} options={{ title: t('report') }} />
                    {/* <Drawer.Screen name="Reports" component={ReportsScreen} options={{ title: t('reports') }} /> */}
                    <Drawer.Screen name="Chat" component={PatientChatScreen} options={{ title: t('chat') }} />
                    <Drawer.Screen name="Nutrition" component={NutritionScreen} options={{ title: t('nutrition') }} />
                    <Drawer.Screen name="Exercise" component={ExerciseScreen} options={{ title: t('exercise') }} />
                    <Drawer.Screen name="Stress" component={StressScreen} options={{ title: t('stress') }} />
                    <Drawer.Screen name="Dermatological" component={DermatologicalScreen} options={{ title: t('dermatological') }} />
                    <Drawer.Screen name="Brain" component={BrainScreen} options={{ title: t('brain') }} />
                </>
            )}
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;

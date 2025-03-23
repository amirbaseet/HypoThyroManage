// navigation/PatientStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import AvailableFormsScreen from "../screens/AvailableFormsScreen";
// import SubmissionHistoryScreen from "../screens/SubmissionHistoryScreen";
// import SymptomFormScreen from "../screens/SymptomFormScreen";
// import ReportScreen from "../screens/ReportScreen";
// import ReportsScreen from "../screens/ReportsScreen";
// import PatientChatScreen from "../screens/PatientChatScreen";
// import NutritionScreen from "../screens/NutritionScreen";
// import ExerciseScreen from "../screens/ExerciseScreen";
// import StressScreen from "../screens/StressScreen";
// import DermatologicalScreen from "../screens/DermatologicalScreen";
// import BrainScreen from "../screens/BrainScreen";



import NutritionScreen from '../screens/NutritionScreen';
import ExerciseScreen from '../screens/ExerciseScreen';
import StressScreen from '../screens/StressScreen';
import DermatologicalScreen from '../screens/DermatologicalScreen';
import BrainScreen from '../screens/BrainScreen';
import ReportScreen from "../screens/ReportScreen";
import ReportsScreen from "../screens/ReportsScreen";
import PatientChatScreen from "../screens/PatientChatScreen ";
import AvailableFormsScreen from "../screens/AvailableFormsScreen";  // Import the chat stack
import SubmissionHistoryScreen from "../screens/SubmissionHistoryScreen";  // Import the chat stack
import SymptomFormScreen from "../screens/SymptomFormScreen";  // Import the chat stack

const Stack = createStackNavigator();

export default function PatientStack() {
    return (
        <Stack.Navigator>
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
                    <Drawer.Screen name="Brain" component={BrainScreen} />        </Stack.Navigator>
    );
}

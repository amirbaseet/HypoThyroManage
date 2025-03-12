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
// import RegisterScreen from '../screens/RegisterScreen';

import { AuthContext } from "../context/AuthContext";

const Drawer = createDrawerNavigator();

// LogoutScreen Component: Handles User Logout

// Drawer Navigation Setup
const DrawerNavigator = () => {
    const { logout } = useContext(AuthContext);

    // ✅ Correctly access the username

    // Console log user state
    return (
        <Drawer.Navigator screenOptions={() => ({
            headerRight: () => (
                <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                    <Text style={{ color: "red", fontSize: 16 }}>Logout</Text>
                </TouchableOpacity>
            ),
        })}
    >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            <Drawer.Screen name="Nutrition" component={NutritionScreen} />
            <Drawer.Screen name="Exercise" component={ExerciseScreen} />
            <Drawer.Screen name="Stress" component={StressScreen} />
            <Drawer.Screen name="Dermatological" component={DermatologicalScreen} />
            <Drawer.Screen name="Brain" component={BrainScreen} />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;

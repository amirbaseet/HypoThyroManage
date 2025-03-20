import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";  // Import Icons
import DoctorChatListScreen from "../screens/DoctorChatListScreen";
import DoctorChatScreen from "../screens/DoctorChatScreen";

const Stack = createStackNavigator();

const DoctorChatStack = ({ navigation }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#4A90E2" },
                headerTintColor: "#FFF",
                headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
            }}
        >
            <Stack.Screen 
                name="DoctorChatList" 
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
                }} 
            />
            <Stack.Screen 
                name="DoctorChatScreen" 
                component={DoctorChatScreen} 
                options={({ route }) => ({ title: route.params.patientName })}
            />
        </Stack.Navigator>
    );
};

export default DoctorChatStack;

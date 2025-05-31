import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const LogoutScreen = () => {
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogout = () => {
        logout();  // Clears user state and AsyncStorage
        navigation.navigate("Login"); // Ensures user is redirected to login
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Are you sure you want to logout?</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

export default LogoutScreen;

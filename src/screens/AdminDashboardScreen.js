import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import api from "../api/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminDashboard = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const getAdminData = async () => {
            const userData = await AsyncStorage.getItem("user");
            if (userData) {
                const parsedUser = JSON.parse(userData);
                if (parsedUser.role === "admin") {
                    setAdmin(parsedUser);
                }
            }
        };
        getAdminData();
    }, []);

    const sendNotification = async () => {
        if (!title.trim() || !message.trim()) {
            Alert.alert("Error", "Title and Message cannot be empty.");
            return;
        }

        try {
            if (!admin || admin.role !== "admin") {
                Alert.alert("Unauthorized", "Only admins can send notifications.");
                return;
            }

            const response = await api.post("/notifications/send-to-all", {
                adminId: admin.id,
                title,
                message,
            });

            Alert.alert("Success", "Notification sent to all users.");
            setTitle("");
            setMessage("");
        } catch (error) {
            console.error("Error sending notification:", error);
            Alert.alert("Error", "Failed to send notification.");
        }
    };

    if (!admin) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Access Denied: Only Admins Can Send Notifications</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Admin Notification Panel</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter Notification Title"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={styles.input}
                placeholder="Enter Notification Message"
                value={message}
                onChangeText={setMessage}
                multiline
            />

            <Button title="Send Notification" onPress={sendNotification} color="#007bff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#343a40",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    errorText: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
    },
});

export default AdminDashboard;

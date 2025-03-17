import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { sendToAllNotifications } from "../services/adminService"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminDashboard = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [admin, setAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    // ✅ Function to get admin data
    const getAdminData = async () => {
        try {
            const userData = await AsyncStorage.getItem("user");
            if (userData) {
                const parsedUser = JSON.parse(userData);
                if (parsedUser.role === "admin") {
                    setAdmin(parsedUser);
                }
            }
        } catch (error) {
            console.error("❌ Error fetching admin data:", error);
        } finally {
            setIsLoading(false); // ✅ Stop loading whether success or failure
        }
    };

    useEffect(() => {
        getAdminData();
    }, []);

    // ✅ Function to send notification
    const sendNotification = async () => {
        if (!title.trim() || !message.trim()) {
            Alert.alert("Error", "Title and Message cannot be empty.");
            return;
        }

        if (!admin || admin.role !== "admin") {
            Alert.alert("Unauthorized", "Only admins can send notifications.");
            return;
        }

        setIsSending(true); // ✅ Disable button to prevent multiple clicks

        try {
            await sendToAllNotifications(title, message);
            Alert.alert("Success", "Notification sent to all users.");
            setTitle("");
            setMessage("");
        } catch (error) {
            console.error("❌ Error sending notification:", error);
            Alert.alert("Error", "Failed to send notification.");
        } finally {
            setIsSending(false); // ✅ Re-enable button
        }
    };

    // ✅ Show loading indicator while fetching admin data
    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    // ✅ Show access denied message for non-admin users
    if (!admin) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>❌ Access Denied: Only Admins Can Send Notifications</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>📢 Admin Notification Panel</Text>

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

            <Button title={isSending ? "Sending..." : "Send Notification"} onPress={sendNotification} color="#007bff" disabled={isSending} />
        </View>
    );
};

// ✅ Improved Styling
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

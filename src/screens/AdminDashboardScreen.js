import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import { sendToAllNotifications } from "../services/adminService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [admin, setAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

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
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAdminData();
    }, []);

    const sendNotification = async () => {
        if (!title.trim() || !message.trim()) {
            Alert.alert(t("error"), t("empty_fields"));
            return;
        }

        if (!admin || admin.role !== "admin") {
            Alert.alert(t("unauthorized"), t("admin_only"));
            return;
        }

        setIsSending(true);

        try {
            await sendToAllNotifications(title, message);
            Alert.alert(t("success"), t("notification_sent"));
            setTitle("");
            setMessage("");
        } catch (error) {
            console.error("❌ Error sending notification:", error);
            Alert.alert(t("error"), t("send_failed"));
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    if (!admin) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>❌ {t("access_denied")}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>{t("admin_panel")}</Text>

            <TextInput
                style={styles.input}
                placeholder={t("notification_title")}
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={styles.input}
                placeholder={t("notification_message")}
                value={message}
                onChangeText={setMessage}
                multiline
            />

            <Button
                title={isSending ? t("sending") : t("send_notification")}
                onPress={sendNotification}
                color="#007bff"
                disabled={isSending}
            />
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

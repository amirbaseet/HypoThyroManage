import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    SafeAreaView
} from "react-native";
import { sendToAllNotifications } from "services/adminService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#C6A477" />
            </View>
        );
    }

    if (!admin) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>❌ {t("access_denied")}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>{t("admin_panel")}</Text>

                <View style={styles.card}>
                    <TextInput
                        style={styles.input}
                        placeholder={t("notification_title")}
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor="#999"
                    />

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder={t("notification_message")}
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        numberOfLines={4}
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity
                        style={[
                            styles.button,
                            isSending && styles.disabledButton,
                        ]}
                        onPress={sendNotification}
                        disabled={isSending}
                    >
                        {isSending ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>
                                {t("send_notification")}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#FAF9F6',
        paddingTop: 20,
    },
    container: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAF9F6',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#444444',
        marginBottom: 25,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFF5E6',
        padding: 20,
        borderRadius: 15,
        borderColor: '#FFD59E',
        borderWidth: 1.5,
        elevation: 2,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        color: '#333',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#4DA8DA', // Sky Blue
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
        buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.6,
    },
    errorText: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
    },
});

export default AdminDashboard;

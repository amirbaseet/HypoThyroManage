import React, { useState, useContext, useRef, useCallback, useEffect } from "react";
import { 
    Text as RNText, ActivityIndicator, StyleSheet, KeyboardAvoidingView,
    Platform, Keyboard, TouchableWithoutFeedback, AppState, View, TouchableOpacity,
} from "react-native";
import { AuthContext } from "context/AuthContext";
import { sendMessageAPI, getChatHistoryAPI, markMessagesAsReadAPI } from "services/chatService";
import { getSocket } from "api/socket";
import { useFocusEffect, useIsFocused, useRoute, useNavigation } from "@react-navigation/native";
import ChatInput from "components/ChatInput";
import ChatList from "components/ChatList";
import { useTranslation } from "react-i18next";
import * as Notifications from "expo-notifications";

const PatientChatScreen = ({ mode }) => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();

    const flatListRef = useRef();
    const socketRef = useRef(null);
    const appState = useRef(AppState.currentState);
    const [isAppActive, setIsAppActive] = useState(true);

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const isDoctor = mode === "doctor";
    const myId = user?.id;
    const otherId = isDoctor ? route.params?.patientId : user?.doctorId;
    const otherName = isDoctor ? route.params?.patientName : null;

    // Register Push Notifications for Patients
    useEffect(() => {
        const registerForPushNotifications = async () => {
            try {
                const { status } = await Notifications.requestPermissionsAsync();
                if (status !== "granted") {
                    console.warn("❌ Push permission denied");
                    return;
                }

                const token = (await Notifications.getExpoPushTokenAsync()).data;
                console.log("✅ Patient Expo push token:", token);


                console.log("✅ Patient push token saved to backend");
            } catch (error) {
                console.error("❌ Error saving patient push token:", error);
            }
        };

        registerForPushNotifications();
    }, []);

    // Ensure WebSocket is initialized
    useEffect(() => {
        getSocket();
    }, []);

    const refreshChat = async () => {
        if (!myId || !otherId) return;
        try {
            setLoading(true);
            const res = await getChatHistoryAPI(myId, otherId);
            setMessages(res);
        } catch (error) {
            console.error("❌ Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const setupSocket = async () => {
        const socket = await getSocket();
        if (!socket) {
            console.error("❌ Socket not available.");
            return;
        }

        socketRef.current = socket;
        socket.off("receiveMessage");

        socket.on("receiveMessage", async (data) => {
            if (data.sender === otherId || data.receiver === otherId) {
                setMessages((prev) => [...prev, data]);
                flatListRef.current?.scrollToEnd({ animated: true });

                if (isFocused && isAppActive) {
                    await markMessagesAsReadAPI(otherId, myId);
                }
            }
        });

        if (otherId) {
            socket.emit("chatOpened", { withUserId: otherId });
            console.log(`🟢 Patient chatOpened emitted for ${otherId}`);
        }
    };

    useFocusEffect(
        useCallback(() => {
            refreshChat();
            setupSocket();

            return () => {
                if (socketRef.current) {
                    socketRef.current.emit("chatClosed");
                    socketRef.current.off("receiveMessage");
                    console.log("🧹 Socket cleaned up");
                }
            };
        }, [otherId, isFocused])
    );

    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            const isNowActive = nextAppState === "active";
            setIsAppActive(isNowActive);
            appState.current = nextAppState;

            if (isNowActive && isFocused) {
                console.log("🔄 App resumed — refreshing and reconnecting...");
                await refreshChat();
                await setupSocket();
            }
        };

        const subscription = AppState.addEventListener("change", handleAppStateChange);
        return () => subscription.remove();
    }, [isFocused, otherId]);

    const sendMessage = async () => {
        if (!otherId || !message.trim()) return;

        const newMessage = { sender: myId, receiver: otherId, message };
        const socket = await getSocket();
        if (!socket) {
            console.error("❌ Cannot send message, socket is unavailable.");
            return;
        }

        socket.emit("sendMessage", newMessage, (ack) => {
            console.log("✅ Acknowledgment:", ack);
        });

        setMessages((prev) => [...prev, newMessage]);

        try {
            await sendMessageAPI(myId, otherId, message);
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }

        setMessage("");
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <RNText style={styles.header}>
                        {isDoctor 
                            ? t("chat_with_patient", { name: otherName }) 
                            : t("chat_with_doctor")
                        }
                    </RNText>
                    {isDoctor && (
                        <TouchableOpacity
                            style={styles.viewButton}
                            onPress={() =>
                                navigation.navigate("DoctorDashboardPopup", {
                                    selectedPatientId: otherId,
                                    defaultTab: "progress",
                                })
                            }
                        >
                            <RNText style={styles.viewButtonText}>{t("view_details")}</RNText>
                        </TouchableOpacity>
                    )}
                </View>

                <ChatList messages={messages} userId={myId} flatListRef={flatListRef} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
                >
                    <ChatInput message={message} onChangeText={setMessage} onSend={sendMessage} />
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#FAF9F6" },
    header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#444444" },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    viewButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#C6A477",
        borderRadius: 8,
    },
    viewButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 13,
    },
});

export default PatientChatScreen;

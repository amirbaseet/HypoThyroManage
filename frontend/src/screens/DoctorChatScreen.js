import React, { useState, useContext, useRef, useCallback, useEffect } from "react";
import { 
    Text as RNText,  ActivityIndicator, StyleSheet, KeyboardAvoidingView,
     Platform, Keyboard, TouchableWithoutFeedback, AppState, View, TouchableOpacity,
} from "react-native";
import { AuthContext } from "context/AuthContext";
import { sendMessageAPI, getChatHistoryAPI, markMessagesAsReadAPI } from "services/chatService";
import { getSocket } from "api/socket";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import ChatInput from "components/ChatInput";
import ChatList from "components/ChatList";
import { useTranslation } from "react-i18next"; // ✅ Import i18n

const DoctorChatScreen = ({ route, navigation  }) => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef();
    const socketRef = useRef(null);
    const doctorId = user?.id;
    const { t } = useTranslation();

    const isFocused = useIsFocused();
    const appState = useRef(AppState.currentState);
    const [isAppActive, setIsAppActive] = useState(true);

    const { patientId, patientName } = route.params || {};

    const refreshChat = async () => {
        if (!patientId || !doctorId) return;
        try {
            setLoading(true);
            const res = await getChatHistoryAPI(doctorId, patientId);
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
            if (data.sender === patientId || data.receiver === patientId) {
                setMessages((prevMessages) => [...prevMessages, data]);
                flatListRef.current?.scrollToEnd({ animated: true });

                if (isFocused && isAppActive) {
                    await markMessagesAsReadAPI(patientId, doctorId);
                }
            }
        });

        console.log("✅ Socket set up for doctor.");
    };

    useFocusEffect(
        useCallback(() => {
            refreshChat();
            setupSocket();

                    // 🟢 Inform server user opened this chat
        if (socketRef.current && patientId) {
            socketRef.current.emit("chatOpened", { withUserId: patientId });
        }

            return () => {
                if (socketRef.current) {
             // 🔴 Inform server user left this chat
                    socketRef.current.emit("chatClosed");
                    socketRef.current.off("receiveMessage");
                    console.log("🧹 Cleaned up socket on blur");
                }
            };
        }, [patientId, isFocused])
    );

    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            const isNowActive = nextAppState === "active";
            setIsAppActive(isNowActive);
            appState.current = nextAppState;

            if (isNowActive && isFocused) {
                console.log("🔄 App resumed — refreshing and reconnecting...");
                await refreshChat();
                await setupSocket(); // Rebind socket on resume
            }
        };

        const subscription = AppState.addEventListener("change", handleAppStateChange);
        return () => subscription.remove();
    }, [isFocused, patientId, doctorId]);

    const sendMessage = async () => {
        if (!patientId || !message.trim()) return;

        const newMessage = { sender: doctorId, receiver: patientId, message };
        const socket = await getSocket();
        if (!socket) {
            console.error("❌ Cannot send message, socket is unavailable.");
            return;
        }

        socket.emit("sendMessage", newMessage, (ack) => {
            console.log("✅ Acknowledgment:", ack);
        });

        setMessages((prevMessages) => [...prevMessages, newMessage]);

        try {
            await sendMessageAPI(doctorId, patientId, message);
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
                        {t("chat_with_patient", { name: patientName })}
                    </RNText>
                    <TouchableOpacity
                        style={styles.viewButton}
                        onPress={() =>
                            navigation.navigate("DoctorDashboardPopup", {
                                selectedPatientId: patientId,
                                defaultTab: "progress",
                            })
                        }
                    >
                        <RNText style={styles.viewButtonText}>{t("view_details")}</RNText>
                    </TouchableOpacity>
                </View>
    
                <ChatList
                    messages={messages}
                    userId={doctorId}
                    flatListRef={flatListRef}
                />
    
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
                >
                    <ChatInput
                        message={message}
                        onChangeText={setMessage}
                        onSend={sendMessage}
                    />
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
export default DoctorChatScreen;

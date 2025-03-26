import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { 
     ActivityIndicator,StyleSheet, Text as RNText,
      KeyboardAvoidingView, Platform, Keyboard, 
    TouchableWithoutFeedback, AppState 
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { sendMessageAPI, getChatHistoryAPI, markMessagesAsReadAPI } from "../services/chatService";
import { getSocket } from "../api/socket"; 
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import ChatList from "../components/ChatList";
import ChatInput from "../components/ChatInput";
import { useTranslation } from "react-i18next"; // ✅ i18n hook

const PatientChatScreen = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef();
    const doctorId = user?.doctorId;
    const userId = user?.id;
    const appState = useRef(AppState.currentState);
    const [isAppActive, setIsAppActive] = useState(true);
    const isFocused = useIsFocused();
    const { t } = useTranslation();

    const refreshChat = async () => {
        if (!doctorId || !userId) return;
        setLoading(true);
        try {
            const res = await getChatHistoryAPI(userId, doctorId);
            setMessages(res);
        } catch (error) {
            console.error("❌ Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            refreshChat();
        }, [doctorId, userId])
    );

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            setIsAppActive(nextAppState === "active");
            appState.current = nextAppState;

            if (nextAppState === "active") {
                refreshChat();
            }
        };

        const subscription = AppState.addEventListener("change", handleAppStateChange);
        return () => subscription.remove();
    }, [doctorId, userId]);
    useFocusEffect(
        useCallback(() => {
            const sendChatPresence = async () => {
                const socket = await getSocket();
                if (socket && doctorId) {
                    socket.emit("chatOpened", { withUserId: doctorId });
                }
            };
    
            sendChatPresence();
    
            return () => {
                const cleanupChatPresence = async () => {
                    const socket = await getSocket();
                    if (socket) {
                        socket.emit("chatClosed");
                    }
                };
                cleanupChatPresence();
            };
        }, [doctorId])
    );
    
    useFocusEffect(
        useCallback(() => {
            if (!doctorId || !userId) return;
    
            let socket;
            let isMounted = true;

            const setupSocket = async () => {
                socket = await getSocket();
                if (!socket) {
                    console.error("❌ Socket not available.");
                    return;
                }

                socket.off("receiveMessage");

                const handleReceiveMessage = async (data) => {
                    if (!isMounted) return;

                    if (data.sender === doctorId || data.receiver === doctorId) {
                        setMessages((prevMessages) => [...prevMessages, data]);
                        flatListRef.current?.scrollToEnd({ animated: true });

                        // ✅ Only mark as read if screen is focused & app is active
                        if (isFocused && isAppActive) {
                            await markMessagesAsReadAPI(doctorId, userId);
                        }
                    }
                };

                socket.on("receiveMessage", handleReceiveMessage);
            };

            setupSocket();

            return () => {
                isMounted = false;
                if (socket) {
                    socket.off("receiveMessage");
                }
            };
        }, [doctorId, userId, isFocused, isAppActive])
    );

    const sendMessage = async () => {
        if (!doctorId || !message.trim()) return;

        const newMessage = { sender: userId, receiver: doctorId, message };
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
            await sendMessageAPI(userId, doctorId, message);
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
            <React.Fragment>
                <RNText style={styles.header}>
                    {t("chat_with_doctor")}
                </RNText>
    
                {doctorId ? (
                    <>
                        <ChatList messages={messages} userId={userId} flatListRef={flatListRef} />
    
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : undefined}
                            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                        >
                            <ChatInput
                                message={message}
                                onChangeText={setMessage}
                                onSend={sendMessage}
                            />
                        </KeyboardAvoidingView>
                    </>
                ) : (
                    <RNText style={styles.noDoctorText}>{t("no_doctor_assigned")}</RNText>
                )}
            </React.Fragment>
        </TouchableWithoutFeedback>
    );
    
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#FAF9F6" },
    header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#444444" },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    noDoctorText: { textAlign: "center", fontSize: 16, color: "#888", marginTop: 20 },
});


export default PatientChatScreen;
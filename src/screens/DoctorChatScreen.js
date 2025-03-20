import React, { useState, useContext, useRef, useCallback } from "react";
import { 
    View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, 
    StyleSheet, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { sendMessageAPI, getChatHistoryAPI, markMessagesAsReadAPI } from "../services/chatService";
import { getSocket } from "../api/socket";
import { useFocusEffect } from "@react-navigation/native";

const DoctorChatScreen = ({ route }) => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef();
    const doctorId = user?.id;
    let socket = null;
    // 🔥 Get Patient ID & Name from route params
    const { patientId, patientName } = route.params || {};

    // ✅ Set selected patient when navigating to this screen
    useFocusEffect(
        useCallback(() => {
            if (!patientId) return;

            const fetchChatHistory = async () => {
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

            fetchChatHistory();
        }, [patientId])
    );

    useFocusEffect(
        useCallback(() => {
            let socket;

            const setupSocket = async () => {
                socket = await getSocket();
                if (!socket) {
                    console.error("❌ Socket not available.");
                    return;
                }

                socket.off("receiveMessage");

                const handleReceiveMessage = async (data) => {
                    console.log("📩 New message received:", data);

                    if (data.sender === patientId || data.receiver === patientId) {
                        setMessages((prevMessages) => [...prevMessages, data]);
                        flatListRef.current?.scrollToEnd({ animated: true });

                        // ✅ Mark messages as read when received
                        await markMessagesAsReadAPI(patientId, doctorId);
                    }
                };

                socket.on("receiveMessage", handleReceiveMessage);

                console.log("✅ Socket connected for doctor.");

                return () => {
                    console.log("🔌 Disconnecting socket on unfocus...");
                    socket.off("receiveMessage", handleReceiveMessage);
                    socket.disconnect();
                };
            };

            setupSocket();

            return () => {
                if (socket) {
                    console.log("🔌 Cleanup: Disconnecting socket...");
                    socket.disconnect();
                }
            };
        }, [patientId])
    );

    const sendMessage = async () => {
        if (!patientId || !message.trim()) return;

        const newMessage = { sender: doctorId, receiver: patientId, message };
        const socket = await getSocket();
        if (!socket) {
            console.error("❌ Cannot send message, socket is unavailable.");
            return;
        }

        socket.emit("sendMessage", newMessage, (ack) => {
            console.log("📩 Sent message:", newMessage);
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
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 90} 
            >
                <Text style={styles.header}>{patientName}'s Chat</Text>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={item.sender === doctorId ? styles.doctorMessage : styles.patientMessage}>
                            <Text style={styles.messageText}>{item.message}</Text>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                <View style={styles.inputWrapper}>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#777"
                        onFocus={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#FAF9F6" },
    header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#444444" },

    doctorMessage: { 
        alignSelf: "flex-end",
        backgroundColor: "#B5E7A0",
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        maxWidth: "75%",
        borderWidth: 2,
        borderColor: "#8AAD60",
    },
    patientMessage: { 
        alignSelf: "flex-start",
        backgroundColor: "#EAE7DC",
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        maxWidth: "75%",
        borderWidth: 2,
        borderColor: "#C6A477",
    },
    messageText: { fontSize: 16, color: "#444444" },

    inputWrapper: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: Platform.OS === "ios" ? 20 : 10 
    },
    input: { 
        flex: 1,
        height: 45, 
        borderWidth: 2, 
        padding: 10, 
        borderRadius: 10, 
        borderColor: "#C6A477", 
        backgroundColor: "#FFF" 
    },
    sendButton: { 
        backgroundColor: "#C6A477",
        paddingVertical: 10, 
        paddingHorizontal: 20, 
        borderRadius: 10, 
        marginLeft: 10 
    },
    sendButtonText: { color: "#FFF", fontWeight: "bold" },

    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default DoctorChatScreen;

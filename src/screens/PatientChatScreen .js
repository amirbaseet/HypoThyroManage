import React, { useState, useEffect, useContext, useRef } from "react";
import { View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Text as RNText, KeyboardAvoidingView, Platform } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { sendMessageAPI, getChatHistoryAPI } from "../services/chatService";
import { getSocket } from "../api/socket"; // ✅ Ensure we use getSocket()

const PatientChatScreen = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const doctorId = user?.doctorId;
    const userId = user?.id;
    const flatListRef = useRef();

    // ✅ Fetch chat history when a doctor is assigned
    useEffect(() => {
        const fetchChatHistory = async () => {
            if (!doctorId) return;
            try {
                const res = await getChatHistoryAPI(userId, doctorId);
                setMessages(res);
            } catch (error) {
                console.error("❌ Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatHistory();
    }, [doctorId]);

    // ✅ Listen for incoming real-time messages and update state
    useEffect(() => {
        if (!doctorId) return;

        const setupSocket = async () => {
            const socket = await getSocket();
            if (!socket) {
                console.error("❌ Socket not available.");
                return;
            }

            // ✅ Remove old listener before adding a new one
            socket.off("receiveMessage"); 

            const handleReceiveMessage = (data) => {
                console.log("📩 New message received:", data);
                if (data.sender === doctorId || data.receiver === doctorId) {
                    setMessages((prevMessages) => [...prevMessages, data]);
                    flatListRef.current?.scrollToEnd({ animated: true });
                }
            };

            socket.on("receiveMessage", handleReceiveMessage);

            return () => {
                socket.off("receiveMessage", handleReceiveMessage); // ✅ Cleanup listener
            };
        };

        setupSocket();
    }, [doctorId]);

    // ✅ Handle sending messages
    const sendMessage = async () => {
        if (!doctorId || !message.trim()) {
            alert("Cannot send an empty message or no assigned doctor.");
            return;
        }

        const newMessage = { sender: userId, receiver: doctorId, message };
        const socket = await getSocket();
        if (!socket) {
            console.error("❌ Cannot send message, socket is unavailable.");
            return;
        }

        // Emit message via WebSocket
        socket.emit("sendMessage", newMessage, (ack) => {
            console.log("📩 Sent message:", newMessage);
            console.log("✅ Acknowledgment:", ack);
        });

        // Update UI instantly
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Persist message to backend
        try {
            await sendMessageAPI(userId, doctorId, message);
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }

        setMessage(""); // Clear input field
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <RNText style={styles.header}>Chat with Your Doctor</RNText>

            {doctorId ? (
                <>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={item.sender === userId ? styles.patientMessage : styles.doctorMessage}>
                                <RNText style={styles.messageText}>{item.message}</RNText>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />
                    
                    {/* Message Input Field */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            style={styles.input}
                            placeholder="Type a message..."
                            placeholderTextColor="#777"
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                            <RNText style={styles.sendButtonText}>Send</RNText>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <RNText style={styles.noDoctorText}>You have no assigned doctor.</RNText>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#FAF9F6" },
    header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#444444" },
    inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    input: { flex: 1, height: 45, borderWidth: 1, padding: 10, borderRadius: 5, borderColor: "#ccc", backgroundColor: "#FFF" },
    sendButton: { backgroundColor: "#4CAF50", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginLeft: 10 },
    sendButtonText: { color: "#FFF", fontWeight: "bold" },
    doctorMessage: { alignSelf: "flex-start", backgroundColor: "#E1BEE7", padding: 10, marginVertical: 5, borderRadius: 10, maxWidth: "75%" },
    patientMessage: { alignSelf: "flex-end", backgroundColor: "#B3E5FC", padding: 10, marginVertical: 5, borderRadius: 10, maxWidth: "75%" },
    messageText: { fontSize: 16, color: "#444444" },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    noDoctorText: { textAlign: "center", fontSize: 16, color: "#888", marginTop: 20 },
});

export default PatientChatScreen;

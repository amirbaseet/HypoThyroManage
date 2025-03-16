import React, { useState, useEffect, useContext, useRef } from "react";
import { View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Text as RNText } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { sendMessageAPI, getChatHistoryAPI } from "../api/apiService";
import socket from "../api/socket";

const PatientChatScreen = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const doctorId = user?.doctorId;
    const userId = user?.id;
    const flatListRef = useRef();

    // ✅ Set User ID when connecting (No auth required)
    useEffect(() => {
        socket.emit("setUserId", userId);
        console.log("🟢 Sent userId to server:", userId);
    }, []);

    useEffect(() => {
        if (!doctorId) {
            setLoading(false);
            return;
        }

        const fetchChatHistory = async () => {
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

        // ✅ Listen for messages
        socket.off("receiveMessage").on("receiveMessage", (data) => {
            console.log("📩 New message received:", data);
            if (data.sender === doctorId || data.receiver === doctorId) {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        });

        return () => {
            socket.off("receiveMessage"); // Cleanup
        };
    }, [doctorId]);

    const sendMessage = async () => {
        if (!doctorId || !message.trim()) {
            alert("Cannot send an empty message or no assigned doctor.");
            return;
        }

        const newMessage = { sender: userId, receiver: doctorId, message };

        socket.emit("sendMessage", newMessage, (ack) => {
            console.log("📩 Sent message:", newMessage);
            console.log("✅ Acknowledgment:", ack);
        });

        setMessages((prevMessages) => [...prevMessages, newMessage]);

        await sendMessageAPI(userId, doctorId, message);
        setMessage("");
    };

    return (
        <View style={styles.container}>
            <RNText style={styles.header}>Chat with Your Doctor</RNText>

            {doctorId ? (
                <>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item, index) => index.toString()}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        renderItem={({ item }) => (
                            <View style={item.sender === userId ? styles.patientMessage : styles.doctorMessage}>
                                <RNText style={styles.messageText}>{item.message}</RNText>
                            </View>
                        )}
                    />
                    <TextInput value={message} onChangeText={setMessage} style={styles.input} placeholder="Type a message..." />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <RNText style={styles.sendButtonText}>Send</RNText>
                    </TouchableOpacity>
                </>
            ) : (
                <RNText style={styles.noDoctorText}>You have no assigned doctor.</RNText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#FAF9F6" },
    header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#444444" },
    input: { height: 40, borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5 },
    sendButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 5 },
    sendButtonText: { color: "#FFF", fontWeight: "bold" },
    doctorMessage: { alignSelf: "flex-start", backgroundColor: "#E1BEE7", padding: 10, marginVertical: 5, borderRadius: 10 },
    patientMessage: { alignSelf: "flex-end", backgroundColor: "#B3E5FC", padding: 10, marginVertical: 5, borderRadius: 10 },
    messageText: { fontSize: 16, color: "#444444" },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    noDoctorText: { textAlign: "center", fontSize: 16, color: "#888", marginTop: 20 },
});

export default PatientChatScreen;

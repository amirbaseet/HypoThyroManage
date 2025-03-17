import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getDoctorPatientsReports, sendMessageAPI, getChatHistoryAPI } from "../api/apiService";
import { getSocket } from "../api/socket";  // ✅ Ensure we use getSocket()

const DoctorChatScreen = () => {
    const { user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef();
    const doctorId = user?.id;

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getDoctorPatientsReports(doctorId);
                setPatients(data.patients);
            } catch (error) {
                console.error("❌ Error fetching patients:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [doctorId]);

    useEffect(() => {
        if (!selectedPatient) return;

        const setupSocket = async () => {
            const socket = await getSocket();
            if (!socket) {
                console.error("❌ Socket not available.");
                return;
            }

            // ✅ Make sure previous listeners are removed before adding a new one
            socket.off("receiveMessage"); 

            const handleReceiveMessage = (data) => {
                console.log("📩 New message received:", data);
            
                // Ensure the message belongs to the current chat
                if ((data.sender === selectedPatient || data.receiver === selectedPatient)) {
                    setMessages((prevMessages) => [...prevMessages, data]);
                    flatListRef.current?.scrollToEnd({ animated: true });
                }
            };
            
            socket.on("receiveMessage", handleReceiveMessage);

            return () => {
                socket.off("receiveMessage", handleReceiveMessage);  // ✅ Cleanup listener
            };
        };

        setupSocket();
    }, [selectedPatient]);

    const fetchChatHistory = async (patientId) => {
        try {
            setSelectedPatient(patientId);
            setLoading(true);
            const res = await getChatHistoryAPI(doctorId, patientId);
            setMessages(res);
        } catch (error) {
            console.error("❌ Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!selectedPatient || !message.trim()) return;

        const newMessage = { sender: doctorId, receiver: selectedPatient, message };
        const socket = await getSocket();
        if (!socket) {
            console.error("❌ Cannot send message, socket is unavailable.");
            return;
        }

        socket.emit("sendMessage", newMessage, (ack) => {
            console.log("📩 Sent message:", newMessage);
            console.log("✅ Acknowledgment:", ack);
        });

        setMessages((prevMessages) => [...prevMessages, newMessage]);  // ✅ Instant UI update

        try {
            await sendMessageAPI(doctorId, selectedPatient, message);
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }

        setMessage("");
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <Text style={styles.header}>Doctor Chat</Text>

            <Text style={styles.subHeader}>Select a Patient:</Text>
            <FlatList
                data={patients}
                keyExtractor={(item) => item._id}
                horizontal
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.patientButton, selectedPatient === item._id && styles.selectedPatient]}
                        onPress={() => fetchChatHistory(item._id)}
                    >
                        <Text style={styles.patientText}>{item.username}</Text>
                    </TouchableOpacity>
                )}
            />

            {selectedPatient && (
                <>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={item.sender === doctorId ? styles.doctorMessage : styles.patientMessage}>
                                <Text style={styles.messageText}>{item.message}</Text>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />
                    
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            style={styles.input}
                            placeholder="Type a message..."
                            placeholderTextColor="#777"
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#FAF9F6" },
    header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#444444" },
    subHeader: { fontSize: 18, fontWeight: "bold", marginTop: 15, color: "#444444" },
    patientButton: { padding: 12, borderRadius: 10, backgroundColor: "#EAE7DC", borderWidth: 2, borderColor: "#C6A477", marginRight: 10 },
    selectedPatient: { backgroundColor: "#B5E7A0", borderColor: "#8AAD60" },
    patientText: { fontSize: 15, fontWeight: "600", color: "#444444" },
    inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    input: { flex: 1, height: 45, borderWidth: 1, padding: 10, borderRadius: 5, borderColor: "#ccc", backgroundColor: "#FFF" },
    sendButton: { backgroundColor: "#4CAF50", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginLeft: 10 },
    sendButtonText: { color: "#FFF", fontWeight: "bold" },
    doctorMessage: { alignSelf: "flex-end", backgroundColor: "#B3E5FC", padding: 10, marginVertical: 5, borderRadius: 10, maxWidth: "75%" },
    patientMessage: { alignSelf: "flex-start", backgroundColor: "#E1BEE7", padding: 10, marginVertical: 5, borderRadius: 10, maxWidth: "75%" },
    messageText: { fontSize: 16, color: "#444444" },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default DoctorChatScreen;
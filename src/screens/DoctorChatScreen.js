import React, { useState, useEffect, useContext, useRef } from "react";
import { 
    View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet 
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getDoctorPatientsReports, sendMessageAPI, getChatHistoryAPI } from "../api/apiService";
import socket from "../api/socket";

const DoctorChatScreen = () => {
    const { user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [chatCache, setChatCache] = useState({});  // 🔹 Chat history caching
    const flatListRef = useRef(null);

    const doctorId = user?.id;

    // ✅ Fetch Patients Once
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

    // ✅ Handle Real-time Messages
    useEffect(() => {
        socket.off("receiveMessage").on("receiveMessage", (data) => {
            console.log("📩 New message received:", data);
            if (data.sender === selectedPatient || data.receiver === selectedPatient) {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        });

        return () => {
            socket.off("receiveMessage");  // Cleanup
        };
    }, [selectedPatient]);

    // ✅ Fetch & Cache Chat History
    const fetchChatHistory = async (patientId) => {
        setSelectedPatient(patientId);
        
        if (chatCache[patientId]) {
            setMessages(chatCache[patientId]); // 🔹 Load from cache
            return;
        }

        try {
            setLoading(true);
            const res = await getChatHistoryAPI(doctorId, patientId);
            setMessages(res);
            setChatCache((prevCache) => ({ ...prevCache, [patientId]: res })); // 🔹 Save to cache
        } catch (error) {
            console.error("❌ Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Send Message with Real-time Update
    const sendMessage = async () => {
        if (!selectedPatient || !message.trim()) return;

        const newMessage = { sender: doctorId, receiver: selectedPatient, message };

        socket.emit("sendMessage", newMessage, (ack) => {
            console.log("📩 Sent message:", newMessage);
            console.log("✅ Acknowledgment:", ack);
        });

        await sendMessageAPI(doctorId, selectedPatient, message);

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
    };

    // ✅ Auto-scroll when new messages arrive
    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    if (loading) {
        return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
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
                    />
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        style={styles.input}
                        placeholder="Type a message..."
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#FAF9F6" },
    header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#444444" },
    subHeader: { fontSize: 18, fontWeight: "bold", marginTop: 15, color: "#444444" },
    patientButton: { padding: 12, borderRadius: 10, backgroundColor: "#EAE7DC", borderWidth: 2, borderColor: "#C6A477", marginRight: 10 },
    selectedPatient: { backgroundColor: "#B5E7A0", borderColor: "#8AAD60" },
    patientText: { fontSize: 15, fontWeight: "600", color: "#444444" },
    input: { height: 40, borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5 },
    sendButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 5 },
    sendButtonText: { color: "#FFF", fontWeight: "bold" },
    doctorMessage: { alignSelf: "flex-end", backgroundColor: "#B3E5FC", padding: 10, marginVertical: 5, borderRadius: 10 },
    patientMessage: { alignSelf: "flex-start", backgroundColor: "#E1BEE7", padding: 10, marginVertical: 5, borderRadius: 10 },
    messageText: { fontSize: 16, color: "#444444" },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default DoctorChatScreen;

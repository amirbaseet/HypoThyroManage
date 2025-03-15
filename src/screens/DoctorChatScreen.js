import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, FlatList, TextStyleSheet, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native"; // ✅ Added StyleSheet import
import { AuthContext } from "../context/AuthContext";
import { getDoctorPatientsReports, sendMessageAPI, getChatHistoryAPI } from "../api/apiService";
import socket from "../api/socket";

const DoctorChatScreen = () => {
    const { user } = useContext(AuthContext); // Get logged-in doctor
    const [patients, setPatients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const doctorId = user?.id;

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getDoctorPatientsReports(doctorId);
                setPatients(data.patients);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        fetchPatients();

        socket.on("receiveMessage", (data) => {
            if (data.sender === selectedPatient) {
                setMessages((prev) => [...prev, data]);
            }
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [selectedPatient]);

    const fetchChatHistory = async (patientId) => {
        try {
            setSelectedPatient(patientId);
            const res = await getChatHistoryAPI(user.id, patientId);
            setMessages(res);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async () => {
        if (!selectedPatient) return;

        socket.emit("sendMessage", { sender: doctorId, receiver: selectedPatient, message });

        await sendMessageAPI(doctorId, selectedPatient, message);

        setMessages([...messages, { sender: doctorId, message }]);
        setMessage("");
    };

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

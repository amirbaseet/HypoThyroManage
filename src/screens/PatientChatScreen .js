import React, { useState, useEffect, useContext } from "react";
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



    useEffect(() => {
        if (!doctorId) {
            setLoading(false);
            return;
        }
    
    
        fetchChatHistory();
    
        // ✅ Listen for new messages
        socket.on("receiveMessage", (data) => {
            console.log("📩 New message received in frontend:", data);
            setMessages((prevMessages) => [...prevMessages, data]);
        });
    
        return () => {
            socket.off("receiveMessage"); // Cleanup listener on unmount
        };
    }, [doctorId]);
    
    const sendMessage = async () => {
        if (!doctorId || !message.trim()) {
            alert("Cannot send an empty message or no assigned doctor.");
            return;
        }

        const newMessage = { sender: userId, receiver: doctorId, message };

        // ✅ Emit the message to the socket server
        socket.emit("sendMessage", newMessage);
        console.log("📩 Sent message:", newMessage);

        // ✅ Call API to store message
        await sendMessageAPI(userId, doctorId, message);

        // ✅ Update UI instantly
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage(""); 
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            <RNText style={styles.header}>Chat with Your Doctor</RNText>

            {doctorId ? (
                <>
                    <FlatList
                        data={messages}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={item.sender === userId ? styles.patientMessage : styles.doctorMessage}>
                                <RNText style={styles.messageText}>{item.message}</RNText>
                            </View>
                        )}
                        extraData={messages} // ✅ Ensures FlatList updates
                    />
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        style={styles.input}
                        placeholder="Type a message..."
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <RNText style={styles.sendButtonText}>Send</RNText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sendButton} onPress={fetchChatHistory}>
    <RNText style={styles.sendButtonText}>Force Refresh</RNText>
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

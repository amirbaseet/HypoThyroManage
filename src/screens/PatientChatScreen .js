import React, { useState, useEffect, useContext, useRef, useCallback  } from "react";
import { 
    View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, 
    StyleSheet, Text as RNText, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { sendMessageAPI, getChatHistoryAPI,markMessagesAsReadAPI } from "../services/chatService";
import { getSocket } from "../api/socket"; 
import { useFocusEffect } from "@react-navigation/native";

const PatientChatScreen = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const doctorId = user?.doctorId;
    const userId = user?.id;
    const flatListRef = useRef();
    
    useFocusEffect(
        useCallback(() => {
            const fetchChatHistory = async () => {
                if (!doctorId) return;
                setLoading(true);
                try {
                    const res = await getChatHistoryAPI(userId, doctorId);
                    setMessages(res);
                    flatListRef.current?.scrollToEnd({ animated: true }); // ✅ Ensure it scrolls to the latest message
                } catch (error) {
                    console.error("❌ Error fetching messages:", error);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchChatHistory();
    
            return () => {
                setMessages([]); // ✅ Reset messages when leaving the screen to ensure fresh data on re-entry
                console.log("leaving")
            };
        }, [doctorId])
    );
        
    useEffect(() => {
        if (!doctorId) return;

        const setupSocket = async () => {
            const socket = await getSocket();
            if (!socket) {
                console.error("❌ Socket not available.");
                return;
            }

            socket.off("receiveMessage"); 

            const handleReceiveMessage = async (data) => {
                console.log("📩 New message received:", data);
                if (data.sender === doctorId || data.receiver === doctorId) {
                    setMessages((prevMessages) => [...prevMessages, data]);
                    flatListRef.current?.scrollToEnd({ animated: true });
              console.log("setting read")
                  // ✅ Mark messages as read when received
                  await markMessagesAsReadAPI(doctorId, userId);
              
                }
            };

            socket.on("receiveMessage", handleReceiveMessage);

            return () => {
                socket.off("receiveMessage", handleReceiveMessage);
            };
        };

        setupSocket();
    }, [doctorId]);

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

        socket.emit("sendMessage", newMessage, (ack) => {
            console.log("📩 Sent message:", newMessage);
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
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 70} // ✅ Adjust for iOS/Android
            >
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
                            contentContainerStyle={{ paddingBottom: 20 }}
                            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        />
                        
                        {/* ✅ Keyboard-Friendly Input Field */}
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
                                <RNText style={styles.sendButtonText}>Send</RNText>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <RNText style={styles.noDoctorText}>You have no assigned doctor.</RNText>
                )}
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#FAF9F6" },
    header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#444444" },
    
    // ✅ Message Styles with Theme Colors
    doctorMessage: { 
        alignSelf: "flex-start",
        backgroundColor: "#EAE7DC",
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        maxWidth: "75%",
        borderWidth: 2,
        borderColor: "#C6A477",
    },
    patientMessage: { 
        alignSelf: "flex-end",
        backgroundColor: "#B5E7A0",
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        maxWidth: "75%",
        borderWidth: 2,
        borderColor: "#8AAD60",
    },
    messageText: { fontSize: 16, color: "#444444" },

    // ✅ Input and Send Button (Keyboard Safe)
    inputWrapper: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: Platform.OS === "ios" ? 20 : 10 // ✅ Fix for keyboard hiding input
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

    // ✅ Loading and No Doctor Message
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    noDoctorText: { textAlign: "center", fontSize: 16, color: "#888", marginTop: 20 },
});

export default PatientChatScreen;
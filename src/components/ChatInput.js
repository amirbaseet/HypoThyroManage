import React from "react";
import { View, TextInput, TouchableOpacity, Text, Platform, StyleSheet } from "react-native";

const ChatInput = ({ message, onChangeText, onSend }) => {
    return (
        <View style={styles.inputWrapper}>
            <TextInput
                value={message}
                onChangeText={onChangeText}
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#777"
            />
            <TouchableOpacity style={styles.sendButton} onPress={onSend}>
                <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: Platform.OS === "ios" ? 20 : 10,
    },
    input: {
        flex: 1,
        height: 45,
        borderWidth: 2,
        padding: 10,
        borderRadius: 10,
        borderColor: "#C6A477",
        backgroundColor: "#FFF",
    },
    sendButton: {
        backgroundColor: "#C6A477",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginLeft: 10,
    },
    sendButtonText: {
        color: "#FFF",
        fontWeight: "bold",
    },
});

export default ChatInput;

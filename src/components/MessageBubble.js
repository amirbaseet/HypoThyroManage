import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ message, isSender }) => {
    return (
        <View style={isSender ? styles.patientMessage : styles.doctorMessage}>
            <Text style={styles.messageText}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default MessageBubble;

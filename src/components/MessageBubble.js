import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import ParsedText from "react-native-parsed-text";

const MessageBubble = ({ message, isSender }) => {
    const handleUrlPress = (url) => {
        Linking.openURL(url).catch((err) => {
            console.error("Failed to open URL:", err);
        });
    };

    return (
        <View style={isSender ? styles.patientMessage : styles.doctorMessage}>
            <ParsedText
                style={styles.messageText}
                parse={[
                    { type: "url", style: styles.link, onPress: handleUrlPress }
                ]}
                childrenProps={{ allowFontScaling: false }}
            >
                {message}
            </ParsedText>
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
    messageText: {
        fontSize: 16,
        color: "#444444",
    },
    link: {
        color: "blue",
        textDecorationLine: "underline",
    },
});

export default MessageBubble;

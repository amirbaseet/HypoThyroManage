import React from "react";
import { View, TextInput, TouchableOpacity, Text, Platform, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next"; // 👈 Add this

const ChatInput = ({ message, onChangeText, onSend }) => {
    const { t } = useTranslation(); // 👈 Translation hook
    return (
        <View style={styles.inputWrapper}>
            <TextInput
                value={message}
                onChangeText={onChangeText}
                style={styles.input}
                placeholder={t("chat_placeholder")}
                placeholderTextColor="#777"
            />
            <TouchableOpacity style={styles.sendButton} onPress={onSend}>
                <Text style={styles.sendButtonText}>{t("chat_send")}</Text>
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

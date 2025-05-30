import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

const SymptomFormScreen = ({ route }) => {
    const { formWindow } = route.params;
    const { t } = useTranslation();

    const openLink = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            alert("Cannot open this link");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{formWindow.title}</Text>
            <Text style={styles.dates}>
                {new Date(formWindow.weekStart).toDateString()} →{" "}
                {new Date(formWindow.weekEnd).toDateString()}
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => openLink(formWindow.symptomSeverityFormLink)}
            >
                <Text style={styles.buttonText}>{t("open_symptom_form")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => openLink(formWindow.copingScaleFormLink)}
            >
                <Text style={styles.buttonText}>{t("open_coping_form")}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center"
    },
    dates: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: "center",
        color: "#666"
    },
    button: {
        backgroundColor: "#007BFF",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 16
    },
    buttonText: {
        color: "#fff",
        fontSize: 16
    }
});

export default SymptomFormScreen;

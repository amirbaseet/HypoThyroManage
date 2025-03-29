import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    Alert,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { markMedicineAsTaken, getWeeklyProgress } from "../services/medicineService";
import { format } from "date-fns";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const TakeMedicineScreen = () => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    const [todayTaken, setTodayTaken] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    const checkTodayStatus = async () => {
        setChecking(true);
        try {
            const data = await getWeeklyProgress();
            const todayStr = format(new Date(), "yyyy-MM-dd");

            let found = false;
            if (data?.weeks?.length) {
                for (const week of data.weeks) {
                    const match = week.logs.find(
                        (log) =>
                            format(new Date(log.date), "yyyy-MM-dd") === todayStr &&
                            log.taken === true
                    );
                    if (match) {
                        found = true;
                        break;
                    }
                }
            }

            setTodayTaken(found);
        } catch (error) {
            console.error("Error checking today's status:", error);
            Alert.alert(t("error"), t("progress_fetch_error"));
        }
        setChecking(false);
    };

    useEffect(() => {
        checkTodayStatus();
    }, []);

    const handleTakeMedicine = async (takenValue) => {
        setLoading(true);
        try {
            const res = await markMedicineAsTaken(takenValue);
            if (!res.error) {
                Alert.alert(t("done"), takenValue ? t("mark_success") : t("mark_missed"));
                setTodayTaken(takenValue);
            } else {
                Alert.alert(t("error"), res.error);
            }
        } catch (err) {
            console.error("Mark medicine error:", err);
            Alert.alert(t("error"), t("mark_fail"));
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>💊 {t("daily_medicine_title")}</Text>

            {checking ? (
    <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />
) : (
    <View style={styles.actionBox}>
        {todayTaken === true && (
            <Text style={styles.statusLabel}>{t("you_marked_taken")}</Text>
        )}
        {todayTaken === false && (
            <Text style={styles.statusLabel}>{t("you_marked_missed")}</Text>
        )}
        {todayTaken === null && (
            <Text style={styles.promptText}>{t("medicine_not_taken")}</Text>
        )}

        <TouchableOpacity
            style={[
                styles.button,
                todayTaken === true && styles.selectedButton,
                loading && styles.disabledButton,
            ]}
            onPress={() => handleTakeMedicine(true)}
            disabled={loading}
        >
            <Text style={styles.buttonText}>{t("take_medicine_btn")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[
                styles.missedButton,
                todayTaken === false && styles.selectedButton,
                loading && styles.disabledButton,
            ]}
            onPress={() => handleTakeMedicine(false)}
            disabled={loading}
        >
            <Text style={styles.buttonText}>{t("missed_medicine_btn")}</Text>
        </TouchableOpacity>
    </View>
)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fffdf8",
        padding: 20,
        justifyContent: "center",
    },
    header: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 40,
        textAlign: "center",
        color: "#3E3E3E",
    },
    loading: {
        alignSelf: "center",
    },
    messageBox: {
        alignItems: "center",
        backgroundColor: "#E7F9ED",
        padding: 30,
        borderRadius: 20,
        borderColor: "#A5D6A7",
        borderWidth: 1.5,
        elevation: 2,
    },
    successMessage: {
        fontSize: 18,
        fontWeight: "500",
        color: "#333",
        marginTop: 10,
        textAlign: "center",
    },
    actionBox: {
        padding: 25,
        backgroundColor: "#FFF5E6",
        borderRadius: 20,
        borderColor: "#FFD59E",
        borderWidth: 1.5,
        elevation: 2,
        alignItems: "center",
    },
    promptText: {
        fontSize: 17,
        marginBottom: 20,
        textAlign: "center",
        color: "#555",
    },
    button: {
        backgroundColor: "#34D399",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    disabledButton: {
        opacity: 0.6,
    },
    missedButton: {
        marginTop: 15,
        backgroundColor: "#EF9A9A",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignItems: "center",
        elevation: 3,
    },
    selectedButton: {
        borderWidth: 2,
        borderColor: "#4CAF50", // or a highlight color
    },
    
    statusLabel: {
        fontSize: 14,
        color: "#4CAF50",
        marginBottom: 10,
        fontWeight: "500",
    },
    
});

export default TakeMedicineScreen;
import React, { useState, useEffect, useContext } from "react";
import { View, Text, Button, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { markMedicineAsTaken, getWeeklyProgress } from "../services/medicineService";
import { format } from "date-fns";
import { AuthContext } from "../context/AuthContext";

const TakeMedicineScreen = () => {
    const { user } = useContext(AuthContext);
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
            Alert.alert("❌ Error", "Failed to fetch today's status.");
        }
        setChecking(false);
    };

    useEffect(() => {
        checkTodayStatus();
    }, []);

    const handleTakeMedicine = async () => {
        setLoading(true);
        try {
            const res = await markMedicineAsTaken();
            if (!res.error) {
                Alert.alert("✅ Done", "You have marked your medicine as taken.");
                setTodayTaken(true);
            } else {
                Alert.alert("❌ Error", res.error);
            }
        } catch (err) {
            console.error("Mark medicine error:", err);
            Alert.alert("❌ Error", "Something went wrong.");
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>💊 Daily Medicine Tracker</Text>

            {checking ? (
                <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />
            ) : todayTaken ? (
                <View style={styles.messageBox}>
                    <Text style={styles.successMessage}>✅ You already took your medicine today!</Text>
                </View>
            ) : (
                <View style={styles.actionBox}>
                    <Text style={styles.promptText}>You haven't taken your medicine today.</Text>
                    <Button
                        title={loading ? "Marking..." : "Take Medicine"}
                        onPress={handleTakeMedicine}
                        color="#C6A477"
                        disabled={loading}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF9F6",
        padding: 20,
        justifyContent: "center",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        color: "#444444",
    },
    loading: {
        alignSelf: "center",
    },
    messageBox: {
        alignItems: "center",
        backgroundColor: "#B5E7A0",
        padding: 20,
        borderRadius: 10,
        borderColor: "#8AAD60",
        borderWidth: 2,
    },
    successMessage: {
        fontSize: 18,
        fontWeight: "600",
        color: "#444",
        textAlign: "center",
    },
    actionBox: {
        padding: 20,
        backgroundColor: "#FFF7E6",
        borderRadius: 10,
        borderColor: "#C6A477",
        borderWidth: 2,
    },
    promptText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center",
        color: "#444444",
    },
});

export default TakeMedicineScreen;

import React, { useCallback, useState, useContext } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    ScrollView
} from "react-native";
import api from "../api/apiService";
import { AuthContext } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

const SubmissionHistoryScreen = () => {
    const { user } = useContext(AuthContext);
    const [submissions, setSubmissions] = useState({
        symptomSubmissions: [],
        copingSubmissions: []
    });
    const [loading, setLoading] = useState(true);

    const userId = user?.id;

    useFocusEffect(
        useCallback(() => {
            const fetchSubmissions = async () => {
                setLoading(true);
                try {
                    const res = await api.get("/patient/form-submissions");
                    setSubmissions(res.data);
                } catch (error) {
                    console.error("❌ Failed to load submissions", error);
                }
                setLoading(false);
            };

            fetchSubmissions();
        }, [userId])
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
    }

    if (
        !submissions.symptomSubmissions?.length &&
        !submissions.copingSubmissions?.length
    ) {
        return (
            <View style={styles.center}>
                <Text>No submissions found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Form Submission History</Text>

            {submissions.symptomSubmissions?.length > 0 && (
                <>
                    <Text style={styles.sectionTitle}>🩺 Semptom Şiddeti</Text>
                    {submissions.symptomSubmissions.map((item) => (
                        <View key={item._id} style={styles.card}>
                            <Text style={styles.title}>
                                {item.formWindowId?.title || "Untitled Form"}
                            </Text>
                            <Text style={styles.subText}>
                                Submitted: {new Date(item.createdAt).toLocaleDateString()}
                            </Text>
                            <Text style={styles.subText}>
                                Week: {new Date(item.formWindowId?.weekStart).toDateString()} →{" "}
                                {new Date(item.formWindowId?.weekEnd).toDateString()}
                            </Text>

                            <View style={styles.symptomGrid}>
                                {item.symptoms.map((symptom) => (
                                    <View
                                        key={symptom.symptomId._id}
                                        style={styles.symptomBox}
                                    >
                                        <Text style={styles.symptomText}>
                                            {symptom.symptomId.name}: {symptom.severity}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </>
            )}

            {submissions.copingSubmissions?.length > 0 && (
                <>
                    <Text style={styles.sectionTitle}>🧠 Başa Çıkma Değerlendirmesi</Text>
                    {submissions.copingSubmissions.map((item) => (
                        <View key={item._id} style={styles.card}>
                            <Text style={styles.title}>
                                {item.formWindowId?.title || "Untitled Coping Form"}
                            </Text>
                            <Text style={styles.subText}>
                                Submitted: {new Date(item.createdAt).toLocaleDateString()}
                            </Text>

                            <View style={styles.symptomGrid}>
                                {item.entries.map((entry, index) => (
                                    <View key={index} style={styles.symptomBox}>
                                        <Text style={styles.symptomText}>
                                            {entry.symptomName}:{" "}
                                            {entry.noComplaint
                                                ? "Şikayetim yok"
                                                : `Seviye ${entry.copingLevel}`}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FAF9F6"
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#2c3e50"
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 15,
        color: "#444",
        textAlign: "center"
    },
    card: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#EAE7DC",
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#C6A477",
        elevation: 3
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#444",
        marginBottom: 5
    },
    subText: {
        fontSize: 13,
        color: "#555",
        marginBottom: 5
    },
    symptomGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 10
    },
    symptomBox: {
        width: "48%",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "#C6A477",
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center"
    },
    symptomText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#444",
        textAlign: "center"
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default SubmissionHistoryScreen;

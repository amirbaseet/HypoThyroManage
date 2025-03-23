import React, { useCallback, useState, useContext } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import api from "../api/apiService";
import { AuthContext } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

const SubmissionHistoryScreen = () => {
    const { user } = useContext(AuthContext);
    const [submissions, setSubmissions] = useState([]);
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

    if (!submissions.length) {
        return (
            <View style={styles.center}>
                <Text>No submissions found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Form Submissions</Text>

            <FlatList
                data={submissions}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>
                            {item.formWindowId?.title || "Untitled Form"}
                        </Text>
                        <Text style={styles.subText}>
                            Submitted on: {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                        <Text style={styles.subText}>
                            Week: {new Date(item.formWindowId?.weekStart).toDateString()} →{" "}
                            {new Date(item.formWindowId?.weekEnd).toDateString()}
                        </Text>

                        <FlatList
                            data={item.symptoms}
                            keyExtractor={(symptom) => symptom.symptomId._id}
                            numColumns={2}
                            columnWrapperStyle={styles.row}
                            renderItem={({ item: symptom }) => (
                                <View style={styles.symptomBox}>
                                    <Text style={styles.symptomText}>
                                        {symptom.symptomId.name}: Severity {symptom.severity}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FAF9F6"
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#444444"
    },
    row: {
        justifyContent: "space-between",
        marginBottom: 10
    },
    card: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#EAE7DC",
        marginBottom: 15,
        borderWidth: 2,
        borderColor: "#C6A477",
        elevation: 3
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#444444",
        marginBottom: 6
    },
    subText: {
        fontSize: 13,
        color: "#555"
    },
    symptomBox: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        margin: 5,
        borderWidth: 2,
        borderColor: "#C6A477",
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center"
    },
    symptomText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#444444",
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

import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getDoctorSymptomSubmissions } from "../services/doctorService";

const DoctorSubmissionsScreen = () => {
    const { user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getDoctorSymptomSubmissions();
            setPatients(data.patients || []);
            setSubmissions(data.submissions || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    const selectPatient = (patientId) => {
        setSelectedPatient(patientId);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Doctor's Dashboard</Text>

            <Text style={styles.subHeader}>Select a Patient:</Text>
            <FlatList
                data={patients}
                keyExtractor={(item) => item._id}
                horizontal
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.patientButton, selectedPatient === item._id && styles.selectedPatient]}
                        onPress={() => selectPatient(item._id)}
                    >
                        <Text style={styles.patientText}>{item.username}</Text>
                    </TouchableOpacity>
                )}
            />

            <Text style={styles.subHeader}>Symptom Form Submissions:</Text>
            <FlatList
                data={submissions.filter((s) => s.userId._id === selectedPatient)}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.reportCard}>
                        <Text style={styles.week}>
                            {item.formWindowId?.title || "Untitled Form"}
                        </Text>
                        <Text style={styles.subText}>
                            Week: {new Date(item.formWindowId?.weekStart).toDateString()} → {new Date(item.formWindowId?.weekEnd).toDateString()}
                        </Text>
                        <Text style={styles.subText}>
                            Submitted on: {new Date(item.createdAt).toLocaleDateString()}
                        </Text>

                        <Text style={styles.symptomTitle}>Symptoms:</Text>
                        {item.symptoms.map((s, index) => (
                            <Text key={index} style={styles.symptom}>
                                • {s.symptomId.name}: Severity {s.severity}
                            </Text>
                        ))}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#FAF9F6" },
    header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#444444" },
    subHeader: { fontSize: 18, fontWeight: "bold", marginTop: 15, color: "#444444" },
    patientButton: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#EAE7DC",
        borderWidth: 2,
        borderColor: "#C6A477",
        marginRight: 10,
    },
    selectedPatient: {
        backgroundColor: "#B5E7A0",
        borderColor: "#8AAD60",
    },
    patientText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#444444",
    },
    reportCard: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#EAE7DC",
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "#C6A477",
    },
    week: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#8AAD60",
        marginBottom: 5,
    },
    subText: {
        fontSize: 13,
        color: "#444",
        marginBottom: 2,
    },
    symptomTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 10,
        color: "#444444",
    },
    symptom: {
        fontSize: 14,
        color: "#444444",
    },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default DoctorSubmissionsScreen;

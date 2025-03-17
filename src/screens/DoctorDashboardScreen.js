import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getDoctorPatientsReports } from "../services/doctorService";


const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [reports, setReports] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    const doctorId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            const data = await getDoctorPatientsReports(doctorId);
            setPatients(data.patients);
            setReports(data.reports);
            setLoading(false);
        };
        fetchData();
    }, []);

    const selectPatient = async (patientId) => {
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

            <Text style={styles.subHeader}>Weekly Reports:</Text>
            <FlatList
                data={reports.filter((report) => report.userId._id === selectedPatient)}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.reportCard}>
                        <Text style={styles.week}>Week: {new Date(item.weekStart).toDateString()}</Text>
                        <Text style={styles.symptomTitle}>Symptoms:</Text>
                        {item.symptoms.map((symptom, index) => (
                            <Text key={index} style={styles.symptom}>
                                {symptom.symptomId.name}
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
    patientButton: { padding: 12, borderRadius: 10, backgroundColor: "#EAE7DC", borderWidth: 2, borderColor: "#C6A477", marginRight: 10 },
    selectedPatient: { backgroundColor: "#B5E7A0", borderColor: "#8AAD60" },
    patientText: { fontSize: 15, fontWeight: "600", color: "#444444" },
    reportCard: { padding: 15, borderRadius: 10, backgroundColor: "#EAE7DC", marginBottom: 10, borderWidth: 2, borderColor: "#C6A477" },
    week: { fontSize: 16, fontWeight: "bold", color: "#8AAD60", marginBottom: 5 },
    symptomTitle: { fontSize: 14, fontWeight: "bold", marginTop: 5, color: "#444444" },
    symptom: { fontSize: 14, color: "#444444" },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    input: { height: 40, borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5 },
    sendButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 5 },
    sendButtonText: { color: "#FFF", fontWeight: "bold" },
    doctorMessage: { alignSelf: "flex-end", backgroundColor: "#B3E5FC", padding: 10, marginVertical: 5, borderRadius: 10 },
    patientMessage: { alignSelf: "flex-start", backgroundColor: "#E1BEE7", padding: 10, marginVertical: 5, borderRadius: 10 },
    messageText: { fontSize: 16, color: "#444444" },
});

export default DoctorDashboard;

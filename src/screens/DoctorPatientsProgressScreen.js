import React, { useEffect, useState, useContext } from "react";
import {
    View,
    ScrollView,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import {
    getDoctorPatientsReports,
    getPatientMedicineProgress,
    getDoctorSymptomSubmissions
} from "../services/doctorService";

const DoctorPatientsProgressScreen = () => {
    const { user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [reports, setReports] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    const doctorId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            const data = await getDoctorPatientsReports(doctorId);
            setPatients(data.patients || []);
            setReports(data.reports || []);

            const submissionData = await getDoctorSymptomSubmissions();
            setSubmissions(submissionData.submissions || []);

            setLoading(false);
        };
        fetchData();
    }, []);

    const selectPatient = async (patientId) => {
        setSelectedPatient(patientId);
        const data = await getPatientMedicineProgress(patientId);
        setProgress(data.logs || []);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Doctor's Patient Progress</Text>

            <Text style={styles.subHeader}>Select a Patient:</Text>
            <FlatList
                data={patients}
                keyExtractor={(item) => item._id}
                horizontal
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.patientButton,
                            selectedPatient === item._id && styles.selectedPatient
                        ]}
                        onPress={() => selectPatient(item._id)}
                    >
                        <Text style={styles.patientText}>{item.username}</Text>
                    </TouchableOpacity>
                )}
            />

            {selectedPatient && (
                <>
                    <Text style={styles.subHeader}>Weekly Symptom Reports:</Text>
                    {reports
                        .filter((r) => r.userId._id === selectedPatient)
                        .map((item) => (
                            <View key={item._id} style={styles.reportCard}>
                                <Text style={styles.week}>Week: {new Date(item.weekStart).toDateString()}</Text>
                                <Text style={styles.symptomTitle}>Symptoms:</Text>
                                {item.symptoms.map((s, i) => (
                                    <Text key={i} style={styles.symptom}>
                                        {s.symptomId.name}
                                    </Text>
                                ))}
                            </View>
                        ))}

                    <Text style={styles.subHeader}>Medicine Progress:</Text>
                    {progress.map((item, i) => (
                        <View key={`${item.date}_${i}`} style={styles.progressItem}>
                            <Text style={styles.progressDate}>
                                {new Date(item.date).toDateString()}
                            </Text>
                            <Text style={styles.status}>
                                {item.taken ? "✅ Taken" : "❌ Missed"}
                            </Text>
                        </View>
                    ))}

                    <Text style={styles.subHeader}>Form Submissions:</Text>
                    {submissions
                        .filter((s) => s.userId._id === selectedPatient)
                        .map((item) => (
                            <View key={item._id} style={styles.reportCard}>
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
                        ))}
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#FAF9F6" },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#444444"
    },
    subHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 5,
        color: "#444444"
    },
    patientButton: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#EAE7DC",
        borderWidth: 2,
        borderColor: "#C6A477",
        marginRight: 10
    },
    selectedPatient: {
        backgroundColor: "#B5E7A0",
        borderColor: "#8AAD60"
    },
    patientText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#444444"
    },
    reportCard: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#EAE7DC",
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "#C6A477"
    },
    week: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#8AAD60",
        marginBottom: 5
    },
    symptomTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 5,
        color: "#444444"
    },
    symptom: {
        fontSize: 14,
        color: "#444444"
    },
    subText: {
        fontSize: 14,
        color: "#555555",
        marginBottom: 2
    },
    progressItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: "#ccc"
    },
    progressDate: {
        fontSize: 15,
        color: "#444444"
    },
    status: {
        fontSize: 15,
        fontWeight: "bold"
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default DoctorPatientsProgressScreen;

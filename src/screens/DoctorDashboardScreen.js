import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ActivityIndicator
} from "react-native";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import { getDoctorPatientsReports } from "../services/doctorService";

import ReportsScreen from "./ReportsScreen";
import SubmissionHistoryScreen from "./SubmissionHistoryScreen";
import ProgressScreen from "./ProgressScreen";

const DoctorDashboardScreen = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    const [selectedTab, setSelectedTab] = useState("symptom");
    const [loading, setLoading] = useState(true);

    const doctorId = user?.id;

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getDoctorPatientsReports(doctorId);
                setPatients(data.patients || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const renderSelectedTab = () => {
        if (!selectedPatient) return null;

        switch (selectedTab) {
            case "symptom":
                return <ReportsScreen patientId={selectedPatient} />;
            case "submission":
                return <SubmissionHistoryScreen patientId={selectedPatient} />;
            case "progress":
                return <ProgressScreen patientId={selectedPatient} />;
            default:
                return null;
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>👨‍⚕️ {t("doctor_dashboard_title")}</Text>

            <Text style={styles.subHeader}>{t("select_patient")}</Text>
            <View style={styles.patientListContainer}>
    <FlatList
        data={patients}
        horizontal
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.patientList}
        renderItem={({ item }) => (
            <TouchableOpacity
                style={[
                    styles.patientButton,
                    selectedPatient === item._id && styles.selectedPatient
                ]}
                onPress={() => setSelectedPatient(item._id)}
            >
                <Text style={styles.patientText}>{item.username}</Text>
            </TouchableOpacity>
        )}
    />
</View>

            {selectedPatient && (
                <>
                        <Text style={styles.subHeader}>{t("select_report_type")}</Text> 
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                selectedTab === "symptom" && styles.activeTab
                            ]}
                            onPress={() => setSelectedTab("symptom")}
                        >
                            <Text style={styles.tabText}>📝 {t("weekly_symptoms")}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                selectedTab === "submission" && styles.activeTab
                            ]}
                            onPress={() => setSelectedTab("submission")}
                        >
                            <Text style={styles.tabText}>📄 {t("form_submissions")}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                selectedTab === "progress" && styles.activeTab
                            ]}
                            onPress={() => setSelectedTab("progress")}
                        >
                            <Text style={styles.tabText}>💊 {t("medicine_progress")}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>{renderSelectedTab()}</View>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF9F6",
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 15,
        color: "#2c3e50",
    },
    subHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#444444",
    },
    patientListContainer: {
        height: 70, // You can adjust this to your liking
        justifyContent: "center",
    },
    patientList: {
        paddingLeft: 5,
    },
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
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: "#EAE7DC",
        borderWidth: 2,
        borderColor: "#C6A477",
        flex: 1,
        marginHorizontal: 5,
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: "#C6A477",
    },
    tabText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
    },
    content: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    subHeader: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        marginTop: 15, // Add some space if needed above tabs
        color: "#444444",
    },
    
});

export default DoctorDashboardScreen;

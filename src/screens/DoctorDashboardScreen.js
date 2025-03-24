import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import { getDoctorPatientsReports } from "../services/doctorService";

import ReportsScreen from "./ReportsScreen";
import SubmissionHistoryScreen from "./SubmissionHistoryScreen";
import ProgressScreen from "./ProgressScreen";

const DoctorDashboardScreen = ({ route, navigation }) => {
    const { selectedPatientId, defaultTab } = route?.params || {};
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    const [selectedPatient, setSelectedPatient] = useState(selectedPatientId || null);
    const [patients, setPatients] = useState([]);
    const [selectedTab, setSelectedTab] = useState(defaultTab || "symptom");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredPatients = patients.filter((patient) =>
        patient.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const selectedPatientObj = patients.find((p) => p._id === selectedPatient);

    return (
        <SafeAreaView style={styles.container}>
            {/* Close button for modal */}
            {selectedPatientId && (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.closeButton}
                >
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
            )}

            <Text style={styles.title}>👨‍⚕️ {t("doctor_dashboard_title")}</Text>

            {/* Show patient name if pre-selected */}
            {selectedPatientId && selectedPatientObj && (
                <Text style={[styles.subHeader, { textAlign: "center", marginBottom: 5 }]}>
                    {selectedPatientObj.username}
                </Text>
            )}

            {/* Show patient picker only if no pre-selected patient */}
            {!selectedPatientId && (
                <>
                    <Text style={styles.subHeader}>{t("select_patient")}</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t("search_patient")}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <View style={styles.patientListContainer}>
                        <FlatList
                            data={filteredPatients}
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
                </>
            )}

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
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    closeButton: {
        position: "absolute",
        top: 15,
        right: 15,
        zIndex: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#2c3e50",
    },
    subHeader: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#444",
    },
    searchInput: {
        height: 44,
        borderColor: "#C6A477",
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#fff",
        fontSize: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    patientListContainer: {
        height: 85,
        justifyContent: "center",
        marginBottom: 10,
    },
    patientList: {
        paddingLeft: 5,
        paddingRight: 10,
    },
    patientButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: "#EAE7DC",
        borderWidth: 2,
        borderColor: "#C6A477",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    selectedPatient: {
        backgroundColor: "#B5E7A0",
        borderColor: "#8AAD60",
    },
    patientText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        backgroundColor: "#EAE7DC",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#C6A477",
        alignItems: "center",
        justifyContent: "center",
    },
    activeTab: {
        backgroundColor: "#C6A477",
        borderColor: "#A6804F",
    },
    tabText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
    },
    content: {
        flex: 1,
        paddingTop: 10,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default DoctorDashboardScreen;

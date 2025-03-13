import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getDoctorPatientsReports } from '../api/apiService';

const DoctorDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [reports, setReports] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    const doctorId = "67d29a8dabe74b816c2f8677"; // Replace with actual doctor ID

    useEffect(() => {
        const fetchData = async () => {
            const data = await getDoctorPatientsReports(doctorId);
            setPatients(data.patients);
            setReports(data.reports);
            setLoading(false);
        };
        fetchData();
    }, [selectedPatient]);

    if (loading) {
        return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
    }

    const filterReportsByPatient = (patientId) => {
        setSelectedPatient(patientId);
    };

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
                        onPress={() => filterReportsByPatient(item._id)}
                    >
                        <Text style={styles.patientText}>{item.username}</Text>
                    </TouchableOpacity>
                )}
            />

            <Text style={styles.subHeader}>Weekly Reports:</Text>
            <FlatList
                data={reports.filter(report => report.userId._id === selectedPatient)}
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
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FAF9F6',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#444444',
    },
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#444444',
    },
    patientButton: {
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#EAE7DC',
        borderWidth: 2,
        borderColor: '#C6A477',
        marginRight: 10,
    },
    selectedPatient: {
        backgroundColor: '#B5E7A0',
        borderColor: '#8AAD60',
    },
    patientText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#444444',
    },
    reportCard: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#EAE7DC',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#C6A477',
    },
    week: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8AAD60',
        marginBottom: 5,
    },
    symptomTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#444444',
    },
    symptom: {
        fontSize: 14,
        color: '#444444',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DoctorDashboard;

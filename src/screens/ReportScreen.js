import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, Alert, StyleSheet } from 'react-native';
import { getSymptoms, submitWeeklyReport } from '../api/apiService';

const ReportScreen = () => {
    const [symptoms, setSymptoms] = useState([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState({});

    useEffect(() => {
        const fetchSymptoms = async () => {
            const data = await getSymptoms();
            setSymptoms(data);
        };
        fetchSymptoms();
    }, []);

    const toggleSymptom = (symptomId) => {
        setSelectedSymptoms(prev => ({
            ...prev,
            [symptomId]: !prev[symptomId] // Toggle true/false
        }));
    };

    const handleSubmit = async () => {
        const userId = "67d13beb81395bb96cd8420b"; // Replace with actual user ID

        const symptomsArray = Object.entries(selectedSymptoms).map(([symptomId, hasSymptom]) => ({
            symptomId,
            hasSymptom
        }));

        if (symptomsArray.length === 0) {
            Alert.alert("Error", "Please select at least one symptom.");
            return;
        }

        const response = await submitWeeklyReport(userId, symptomsArray);

        if (response.message) {
            Alert.alert("Success", "Weekly report submitted!");
        } else {
            Alert.alert("Error", response.error || "Submission failed");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select Symptoms</Text>

            {/* Grid Layout with 2 columns */}
            <FlatList
                data={symptoms}
                keyExtractor={(item) => item._id}
                numColumns={2} // ✅ Display 2 symptoms per row
                columnWrapperStyle={styles.row} // ✅ Ensures even spacing
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.symptomButton,
                            selectedSymptoms[item._id] && styles.selectedSymptom
                        ]}
                        onPress={() => toggleSymptom(item._id)}
                    >
                        <Text style={styles.symptomText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.buttonContainer}>
                <Button title="Submit Report" onPress={handleSubmit} color="#007BFF" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    row: {
        justifyContent: 'space-between', // Ensures equal spacing
        marginBottom: 10,
    },
    symptomButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        margin: 5,
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#007BFF',
    },
    selectedSymptom: {
        backgroundColor: '#007BFF',
        borderColor: '#0056B3',
    },
    symptomText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007BFF',
    },
    buttonContainer: {
        marginTop: 20,
        padding: 10,
        alignSelf: 'center',
        width: '100%',
    },
});

export default ReportScreen;

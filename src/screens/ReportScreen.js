import React, { useEffect, useState, useContext  } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, Alert, StyleSheet } from 'react-native';
import { getSymptoms} from '../services/symptomsService';
import {  submitWeeklyReport } from '../services/patientService';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const ReportScreen = () => {
    const { user } = useContext(AuthContext);
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

        const userId = user?.id; // 🔹 Get user ID dynamically
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
            setSelectedSymptoms({});//reset the SelectedSymptoms
        } else {
            Alert.alert("Error", response.error || "Submission failed");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select Symptoms </Text>

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
        backgroundColor: '#FAF9F6',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#444444',
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
        backgroundColor: '#EAE7DC',
        borderWidth: 2,
        borderColor: '#C6A477',
        justifyContent:'center',
    },
    selectedSymptom: {
        backgroundColor: '#B5E7A0',
        borderColor: '#8AAD60',
    },
    symptomText: {
        fontSize: 15,
        fontWeight: '600',
        textAlign:'center',
        color: '#444444',
    },
    buttonContainer: {
        marginTop: 20,
        padding: 10,
        alignSelf: 'center',
        width: '100%',
    },
});

export default ReportScreen;

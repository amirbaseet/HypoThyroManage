import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, Alert, StyleSheet } from "react-native";
import { getSymptoms } from "../services/symptomsService";
import { getLatestSymptomForm, submitSymptomForm } from "../services/patientService";
import { AuthContext } from "../context/AuthContext";

const SymptomFormScreen = ({ route, navigation }) => {
    const { user } = useContext(AuthContext);
    const { formWindow } = route.params;

    const [symptoms, setSymptoms] = useState([]);
    const [selectedSeverities, setSelectedSeverities] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [symptomsList, latestForm] = await Promise.all([
                getSymptoms(),
                getLatestSymptomForm(user?.id, formWindow._id)
            ]);

            setSymptoms(symptomsList);

            const prefilled = {};
            symptomsList.forEach(symptom => {
                const previous = latestForm?.symptoms?.find(
                    s => s.symptomId._id === symptom._id
                );
                prefilled[symptom._id] = previous ? previous.severity : 0;
            });

            setSelectedSeverities(prefilled);
        } catch (error) {
            console.error("❌ Error fetching data:", error);
            Alert.alert("Error", "Failed to load form data.");
        }
    };

    const cycleSeverity = (symptomId) => {
        setSelectedSeverities(prev => ({
            ...prev,
            [symptomId]: (prev[symptomId] + 1) % 6
        }));
    };

    const handleSubmit = async () => {
        const formatted = Object.entries(selectedSeverities).map(([symptomId, severity]) => ({
            symptomId,
            severity
        }));

        setLoading(true);
        const res = await submitSymptomForm(formWindow._id, formatted);
        setLoading(false);

        if (res.error) {
            Alert.alert("Error", res.error);
        } else {
            Alert.alert("Success", "Form submitted!");
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{formWindow.title}</Text>

            <FlatList
                data={symptoms}
                keyExtractor={(item) => item._id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => {
                    const severity = selectedSeverities[item._id] ?? 0;
                    return (
                        <TouchableOpacity
                            style={[
                                styles.symptomButton,
                                severity > 0 && styles.selectedSymptom
                            ]}
                            onPress={() => cycleSeverity(item._id)}
                        >
                            <Text style={styles.symptomText}>{item.name}</Text>
                            <Text style={styles.severityText}>Severity: {severity}</Text>
                        </TouchableOpacity>
                    );
                }}
            />

            <View style={styles.buttonContainer}>
                <Button
                    title={loading ? "Submitting..." : "Submit Form"}
                    onPress={handleSubmit}
                    disabled={loading}
                    color="#007BFF"
                />
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
        justifyContent: 'space-between',
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
        justifyContent: 'center',
    },
    selectedSymptom: {
        backgroundColor: '#B5E7A0',
        borderColor: '#8AAD60',
    },
    symptomText: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        color: '#444444',
    },
    severityText: {
        marginTop: 8,
        fontSize: 13,
        color: '#333',
    },
    buttonContainer: {
        marginTop: 20,
        padding: 10,
        alignSelf: 'center',
        width: '100%',
    },
});

export default SymptomFormScreen;

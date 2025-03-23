import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Button,
    Alert,
    StyleSheet
} from "react-native";
import { getSymptoms } from "../services/symptomsService";
import { getLatestSymptomForm, submitSymptomForm } from "../services/patientService";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const SymptomFormScreen = ({ route, navigation }) => {
    const { user } = useContext(AuthContext);
    const { formWindow } = route.params;
    const { t } = useTranslation();

    const [symptoms, setSymptoms] = useState([]);
    const [selectedSeverities, setSelectedSeverities] = useState({});
    const [copingResponses, setCopingResponses] = useState({});
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
            Alert.alert(t("error"), t("form_load_failed"));
        }
    };

    const cycleSeverity = (symptomId) => {
        setSelectedSeverities(prev => ({
            ...prev,
            [symptomId]: (prev[symptomId] + 1) % 6
        }));
    };

    const toggleNoComplaint = (symptomName) => {
        setCopingResponses((prev) => ({
            ...prev,
            [symptomName]: {
                ...prev[symptomName],
                noComplaint: !prev[symptomName]?.noComplaint,
                copingLevel: null
            }
        }));
    };

    const setCopingLevel = (symptomName, level) => {
        setCopingResponses((prev) => ({
            ...prev,
            [symptomName]: {
                noComplaint: false,
                copingLevel: level
            }
        }));
    };

    const handleSubmit = async () => {
        const formatted = Object.entries(selectedSeverities).map(([symptomId, severity]) => ({
            symptomId,
            severity
        }));

        const formattedCoping = Object.entries(copingResponses).map(([symptomName, data]) => ({
            symptomName,
            copingLevel: data.noComplaint ? null : data.copingLevel,
            noComplaint: data.noComplaint
        }));

        setLoading(true);
        const res = await submitSymptomForm(formWindow._id, formatted, formattedCoping);
        setLoading(false);

        if (res.error) {
            Alert.alert(t("error"), res.error);
        } else {
            Alert.alert(t("success"), t("form_submitted"));
            navigation.goBack();
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>{formWindow.title}</Text>

            <Text style={styles.sectionTitle}>1. {t("symptom_severity")}</Text>
            <View style={styles.symptomGrid}>
                {symptoms.map((item) => {
                    const severity = selectedSeverities[item._id] ?? 0;
                    return (
                        <TouchableOpacity
                            key={item._id}
                            style={[
                                styles.symptomButton,
                                severity > 0 && styles.selectedSymptom
                            ]}
                            onPress={() => cycleSeverity(item._id)}
                        >
                            <Text style={styles.symptomText}>{item.name}</Text>
                            <Text style={styles.severityText}>{t("severity")}: {severity}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <Text style={styles.sectionTitle}>2. {t("coping_assessment")}</Text>
            {symptoms.map((symptom) => {
                const coping = copingResponses[symptom.name] || {};
                return (
                    <View key={symptom._id} style={styles.copingItem}>
                        <Text style={styles.copingSymptom}>{symptom.name}</Text>

                        <TouchableOpacity
                            onPress={() => toggleNoComplaint(symptom.name)}
                            style={styles.noComplaintBtn}
                        >
                            <Text style={{
                                color: coping.noComplaint ? '#2e7d32' : '#aaa',
                                fontWeight: '600'
                            }}>
                                {coping.noComplaint ? `✔ ${t("no_complaint")}` : t("mark_no_complaint")}
                            </Text>
                        </TouchableOpacity>

                        {!coping.noComplaint && (
                            <View style={styles.levelButtons}>
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <TouchableOpacity
                                        key={level}
                                        style={[
                                            styles.levelBtn,
                                            coping.copingLevel === level && styles.activeLevelBtn
                                        ]}
                                        onPress={() => setCopingLevel(symptom.name, level)}
                                    >
                                        <Text style={{
                                            color: coping.copingLevel === level ? "#fff" : "#444"
                                        }}>{level}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                );
            })}

            <View style={styles.buttonContainer}>
                <Button
                    title={loading ? t("submitting") : t("submit_form")}
                    onPress={handleSubmit}
                    disabled={loading}
                    color="#007BFF"
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FAF9F6',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#2c3e50',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginVertical: 15,
        color: '#444',
    },
    symptomGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    symptomButton: {
        width: '48%',
        padding: 12,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#EAE7DC',
        borderWidth: 1.5,
        borderColor: '#C6A477',
    },
    selectedSymptom: {
        backgroundColor: '#B5E7A0',
        borderColor: '#8AAD60',
    },
    symptomText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    severityText: {
        fontSize: 13,
        marginTop: 6,
        color: '#555',
        textAlign: 'center',
    },
    copingItem: {
        marginBottom: 20,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    copingSymptom: {
        fontWeight: '600',
        fontSize: 15,
        marginBottom: 5,
        color: '#222',
    },
    noComplaintBtn: {
        marginBottom: 8,
    },
    levelButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    levelBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#f5f5f5",
        marginRight: 5,
    },
    activeLevelBtn: {
        backgroundColor: "#007BFF",
        borderColor: "#007BFF",
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 50,
    }
});

export default SymptomFormScreen;

import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Button,
    Alert,
    StyleSheet
} from 'react-native';
import { getSymptoms } from '../services/symptomsService';
import { submitWeeklyReport, getLatestWeeklyReport } from '../services/patientService';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const ReportScreen = () => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    const [symptoms, setSymptoms] = useState([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [symptomsData, latestReport] = await Promise.all([
                    getSymptoms(),
                    getLatestWeeklyReport(user?.id)
                ]);

                setSymptoms(symptomsData);

                if (latestReport?.symptoms) {
                    const preSelected = {};
                    latestReport.symptoms.forEach(({ symptomId, hasSymptom }) => {
                        preSelected[symptomId._id] = hasSymptom;
                    });

                    setSelectedSymptoms(preSelected);
                }
            } catch (error) {
                console.log("❌ Patient has no previous report:", error);
            }
        };

        fetchData();
    }, [user?.id]);

    const toggleSymptom = (symptomId) => {
        setSelectedSymptoms(prev => ({
            ...prev,
            [symptomId]: !prev[symptomId]
        }));
    };

    const handleSubmit = async () => {
        const userId = user?.id;
        const symptomsArray = Object.entries(selectedSymptoms).map(([symptomId, hasSymptom]) => ({
            symptomId,
            hasSymptom
        }));

        if (symptomsArray.length === 0) {
            Alert.alert(t("error"), t("select_at_least_one"));
            return;
        }

        const response = await submitWeeklyReport(userId, symptomsArray);

        if (response.message) {
            Alert.alert(t("success"), t("weekly_report_success"));
            // setSelectedSymptoms({});
        } else {
            Alert.alert(t("error"), response.error || t("submission_failed"));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{t("select_symptoms")}</Text>

            <FlatList
                data={symptoms}
                keyExtractor={(item) => item._id}
                numColumns={2}
                columnWrapperStyle={styles.row}
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
                <Button
                    title={t("submit_report")}
                    onPress={handleSubmit}
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
    buttonContainer: {
        marginTop: 20,
        padding: 10,
        alignSelf: 'center',
        width: '100%',
    },
});

export default ReportScreen;

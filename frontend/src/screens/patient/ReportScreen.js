//Weekly report screen
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
import { getSymptoms } from 'services/symptomsService';
import { submitWeeklyReport, getLatestWeeklyReport } from 'services/patientService';
import { AuthContext } from 'context/AuthContext';
import { useTranslation } from 'react-i18next';

const ReportScreen = () => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    const [symptoms, setSymptoms] = useState([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState({});
    const [isFirstTimeThisWeek, setIsFirstTimeThisWeek] = useState(false);
    const [loading, setLoading] = useState(true);

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

                setIsFirstTimeThisWeek(false);
            } catch (error) {
                if (error?.response?.status === 404) {
                    console.log("🆕 No report found for this week — user should submit a new one.");
                    const symptomsData = await getSymptoms();
                    setSymptoms(symptomsData);
                    setSelectedSymptoms({});
                    setIsFirstTimeThisWeek(true);
                    
                  }
                   else {
                    console.error("❌ Unexpected error fetching report:", error);
                    Alert.alert(t("error"), t("submission_failed"));
                }
            } finally {
                setLoading(false);
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
        } else {
            Alert.alert(t("error"), response.error || t("submission_failed"));
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>{t("loading")}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{t("select_symptoms")}</Text>

            {isFirstTimeThisWeek && (
                <Text style={styles.infoText}>
                    🆕 {t("no_report_this_week")}
                </Text>
            )}

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
        marginBottom: 10,
        textAlign: 'center',
        color: '#444444',
    },
    infoText: {
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 14,
        color: '#777',
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
    loadingText: {
        marginTop: 100,
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
    },
});

export default ReportScreen;

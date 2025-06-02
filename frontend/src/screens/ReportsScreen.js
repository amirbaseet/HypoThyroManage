//its history report screen
import React, { useCallback, useState, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { getUserReports } from 'services/patientService';
import { AuthContext } from 'context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'; // ✅ Import i18n

const ReportsScreen = ({ patientId = null }) => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation(); // ✅ Use the hook
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const userIdToFetch = patientId || user?.id;

    useFocusEffect(
        useCallback(() => {
            if (!userIdToFetch) return;

            const fetchReports = async () => {
                setLoading(true);
                try {
                    const data = await getUserReports(userIdToFetch);
                    setReports(data);
                } catch (error) {
                    console.error("Error fetching reports:", error);
                }
                setLoading(false);
            };

            fetchReports();
        }, [userIdToFetch])
    );

    if (loading) {
        return (
            <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{t('weekly_reports')}</Text>

            <FlatList
                data={reports}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.reportCard}>
                        <Text style={styles.week}>
                            📅 {t('week')}: {new Date(item.weekStart).toDateString()}
                        </Text>

                        <Text style={styles.symptomTitle}>📝 {t('symptoms')}:</Text>

                        <FlatList
                            data={item.symptoms}
                            keyExtractor={(symptom) => symptom.symptomId._id}
                            numColumns={2}
                            columnWrapperStyle={styles.row}
                            renderItem={({ item: symptom }) => (
                                <View
                                    style={[
                                        styles.symptomButton,
                                        symptom.hasSymptom && styles.selectedSymptom
                                    ]}
                                >
                                    <Text style={styles.symptomText}>
                                        {symptom.symptomId.name} {symptom.hasSymptom ? '✅' : '❌'}
                                    </Text>
                                </View>
                            )}
                        />
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
    row: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    reportCard: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#EAE7DC',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#C6A477',
        elevation: 3,
    },
    week: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444444',
        marginBottom: 8,
    },
    symptomTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#444444',
        marginBottom: 5,
    },
    symptomButton: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        margin: 5,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#C6A477',
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
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ReportsScreen;

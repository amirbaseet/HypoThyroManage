import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { markMedicineAsTaken, getWeeklyProgress } from '../services/medicineService';
import { format } from 'date-fns';

const PatientHomeScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    const [todayTaken, setTodayTaken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    const checkTodayStatus = async () => {
        setChecking(true);
        try {
            const data = await getWeeklyProgress();
            const todayStr = format(new Date(), 'yyyy-MM-dd');

            let found = null;
            if (data?.weeks?.length) {
                for (const week of data.weeks) {
                    const match = week.logs.find(
                        (log) =>
                            format(new Date(log.date), 'yyyy-MM-dd') === todayStr
                    );
                    if (match) {
                        found = match.taken;
                        break;
                    }
                }
            }

            setTodayTaken(found);
        } catch (error) {
            console.error("Error checking today's status:", error);
            Alert.alert(t("error"), t("progress_fetch_error"));
        }
        setChecking(false);
    };

    useEffect(() => {
        checkTodayStatus();
    }, []);

    const handleTakeMedicine = async (takenValue) => {
        setLoading(true);
        try {
            const res = await markMedicineAsTaken(takenValue);
            if (!res.error) {
                Alert.alert(t("done"), takenValue ? t("mark_success") : t("mark_missed"));
                setTodayTaken(takenValue);
            } else {
                Alert.alert(t("error"), res.error);
            }
        } catch (err) {
            console.error("Mark medicine error:", err);
            Alert.alert(t("error"), t("mark_fail"));
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>
                    {user?.username ? `${t('welcome')}, ${user.username}! 👋` : t('welcome')}
                </Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>💊 {t("daily_medicine_title")}</Text>

                    {checking ? (
                        <ActivityIndicator size="small" color="#C6A477" />
                    ) : (
                        <View style={{ alignItems: 'center' }}>
                            {todayTaken === true && (
                                <Text style={styles.statusLabel}>{t("you_marked_taken")}</Text>
                            )}
                            {todayTaken === false && (
                                <Text style={styles.statusLabel}>{t("you_marked_missed")}</Text>
                            )}
                            {todayTaken === null && (
                                <Text style={styles.statusLabel}>{t("medicine_not_taken")}</Text>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.actionButton,
                                    todayTaken === true && styles.selectedButton,
                                    loading && styles.disabledButton,
                                ]}
                                onPress={() => handleTakeMedicine(true)}
                                disabled={loading}
                            >
                                <Text style={styles.actionButtonText}>{t("take_medicine_btn")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.missedButton,
                                    todayTaken === false && styles.selectedButton,
                                    loading && styles.disabledButton,
                                ]}
                                onPress={() => handleTakeMedicine(false)}
                                disabled={loading}
                            >
                                <Text style={styles.actionButtonText}>{t("missed_medicine_btn")}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <TouchableOpacity
    style={[styles.button, { backgroundColor: '#6D676E' }]}
    onPress={() => navigation.navigate('PatientVideosScreen')}
>
    <Text style={styles.buttonText}>{t('videos')}</Text>
</TouchableOpacity>

<TouchableOpacity
    style={[styles.button, { backgroundColor: '#7BB661' }]}
    onPress={() => navigation.navigate('HypothyroidInfo')}
>
    <Text style={styles.buttonText}>{t('hypothyroid_info')}</Text>
</TouchableOpacity>

<TouchableOpacity
    style={[styles.button, { backgroundColor: '#F4A259' }]}
    onPress={() => navigation.navigate('ReportsMenuScreen')}
>
    <Text style={styles.buttonText}>{t('reports_menu')}</Text>
</TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#444',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFF5E6',
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1.5,
        borderColor: '#FFD59E',
        alignItems: 'center',
        width: '100%',
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#444',
    },
    actionButton: {
        backgroundColor: '#34D399',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 10,
    },
    missedButton: {
        backgroundColor: '#EF9A9A',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 10,
    },
    selectedButton: {
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    statusLabel: {
        fontSize: 14,
        color: '#4CAF50',
        marginBottom: 10,
        fontWeight: '500',
        textAlign: 'center',
    },
    disabledButton: {
        opacity: 0.6,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PatientHomeScreen;
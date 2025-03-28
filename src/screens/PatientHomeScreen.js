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

    const [todayTaken, setTodayTaken] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    const checkTodayStatus = async () => {
        setChecking(true);
        try {
            const data = await getWeeklyProgress();
            const todayStr = format(new Date(), 'yyyy-MM-dd');

            let found = false;
            if (data?.weeks?.length) {
                for (const week of data.weeks) {
                    const match = week.logs.find(
                        (log) =>
                            format(new Date(log.date), 'yyyy-MM-dd') === todayStr &&
                            log.taken === true
                    );
                    if (match) {
                        found = true;
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

    const handleTakeMedicine = async () => {
        setLoading(true);
        try {
            const res = await markMedicineAsTaken();
            if (!res.error) {
                Alert.alert(t("done"), t("mark_success"));
                setTodayTaken(true);
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
                    ) : todayTaken ? (
                        <Text style={styles.successMessage}>{t("medicine_taken_msg")}</Text>
                    ) : (
                        <TouchableOpacity
                            style={[styles.actionButton, loading && styles.disabledButton]}
                            onPress={handleTakeMedicine}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.actionButtonText}>{t("take_medicine_btn")}</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#6D676E' }]} // Videos button
                    onPress={() => navigation.navigate('Patient', { screen: 'PatientVideosScreen' })}
                >
                    <Text style={styles.buttonText}>{t('videos')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#7BB661' }]} // Hypothyroid button
                    onPress={() => navigation.navigate('Patient', { screen: 'HypothyroidInfo' })}
                >
                    <Text style={styles.buttonText}>{t('hypothyroid_info')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#F4A259' }]} // Reports button
                    onPress={() => navigation.navigate('Reports', { screen: 'ReportsMenuScreen' })}
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
        backgroundColor: '#C6A477',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    successMessage: {
        color: '#4CAF50',
        fontWeight: '500',
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

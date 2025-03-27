import React, { useContext, useEffect,useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Alert, ActivityIndicator } from 'react-native';
import { markMedicineAsTaken, getWeeklyProgress } from '../services/medicineService';
import { format } from 'date-fns';

const navigationOptions = [
    { route: 'Nutrition', icon: 'restaurant-outline', labelKey: 'nutrition' },
    { route: 'Exercise', icon: 'barbell-outline', labelKey: 'exercise' },
    { route: 'Stress', icon: 'pulse-outline', labelKey: 'stress' },
    { route: 'Dermatological', icon: 'leaf-outline', labelKey: 'dermatological' },
    { route: 'Brain', icon: 'bulb-outline', labelKey: 'brain' },
];

const PatientMenuScreen = () => {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    const [todayTaken, setTodayTaken] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    
    const checkTodayStatus = async () => {
        setChecking(true);
        try {
            const data = await getWeeklyProgress();
            const todayStr = format(new Date(), "yyyy-MM-dd");
    
            let found = false;
            if (data?.weeks?.length) {
                for (const week of data.weeks) {
                    const match = week.logs.find(
                        (log) =>
                            format(new Date(log.date), "yyyy-MM-dd") === todayStr &&
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
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.header}>
                        {user?.username ? `${t('welcome')}, ${user.username}! 👋` : t('welcome')}
                    </Text>
                    <View style={styles.takeMedicineSection}>
    <Text style={styles.takeMedicineHeader}>💊 {t("daily_medicine_title")}</Text>

    {checking ? (
        <ActivityIndicator size="small" color="#C6A477" />
    ) : todayTaken ? (
        <Text style={styles.takenMessage}>{t("medicine_taken_msg")}</Text>
    ) : (
        <TouchableOpacity
            style={[styles.takeMedicineButton, loading && styles.disabledButton]}
            onPress={handleTakeMedicine}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.takeMedicineButtonText}>{t("take_medicine_btn")}</Text>
            )}
        </TouchableOpacity>
    )}
</View>

                </View>
                <Text style={styles.header}> {t("video_yonlendir")}</Text>

                <View style={styles.menuContainer}>
                    {navigationOptions.map((item) => (
                        <TouchableOpacity
                            key={item.route}
                            style={styles.card}
                            onPress={() => navigation.navigate(item.route)}
                        >
                            <Ionicons name={item.icon} size={28} color="#C6A477" />
                            <Text style={styles.cardText}>{t(item.labelKey)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#FAF9F6',
        paddingTop:20
    },
    scrollView: {
        flex: 1,
    },
    container: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    topContainer: {
        marginBottom: 25,
        alignItems: 'center',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#444444',
        marginBottom: 20,
        textAlign: 'center',
    },
    menuContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: 15,
    },
    card: {
        width: '47%',
        backgroundColor: '#EAE7DC',
        paddingVertical: 25,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#C6A477',
        elevation: 3,
    },
    cardText: {
        marginTop: 10,
        fontSize: 15,
        fontWeight: '600',
        color: '#444444',
        textAlign: 'center',
    },
    takeMedicineSection: {
        backgroundColor: '#FFF5E6',
        padding: 15,
        borderRadius: 15,
        marginBottom: 25,
        borderColor: '#FFD59E',
        borderWidth: 1.5,
        alignItems: 'center',
        elevation: 2,
    },
    takeMedicineHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginBottom: 10,
    },
    takeMedicineButton: {
        backgroundColor: '#C6A477',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    takeMedicineButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    takenMessage: {
        color: '#4CAF50',
        fontWeight: '500',
    },
    disabledButton: {
        opacity: 0.6,
    },
    
});

export default PatientMenuScreen;

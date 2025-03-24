import React, { useCallback, useState, useContext } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert
} from "react-native";
import { getWeeklyProgress } from "../services/medicineService";
import { AuthContext } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { getFormattedDate, getWeekday } from "../utils/date";
import { useTranslation } from "react-i18next";

const ProgressScreen = ({ patientId = null }) => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);

    const userIdToFetch = patientId || user?.id;

    useFocusEffect(
        useCallback(() => {
            if (!userIdToFetch) return;

            const loadProgress = async () => {
                setLoading(true);
                try {
                    const data = await getWeeklyProgress(userIdToFetch); // Pass userId
                    if (!data.error) {
                        setWeeks(data.weeks);
                    } else {
                        Alert.alert(t("error"), data.error || t("progress_fetch_error"));
                    }
                } catch (err) {
                    console.error("Error loading progress:", err);
                    Alert.alert(t("error"), t("progress_fetch_fallback"));
                }
                setLoading(false);
            };

            loadProgress();
        }, [userIdToFetch])
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>📈 {t("weekly_medicine_progress")}</Text>

            <FlatList
                data={weeks}
                keyExtractor={(item, index) => `${item.weekStart}_${index}`}
                renderItem={({ item }) => (
                    <View style={styles.reportCard}>
                        <Text style={styles.week}>
                            📅 {getFormattedDate(item.weekStart)} - {getFormattedDate(item.weekEnd)}
                        </Text>

                        <FlatList
                            data={item.logs}
                            keyExtractor={(log, i) => `${log.date}_${i}`}
                            numColumns={2}
                            columnWrapperStyle={styles.row}
                            renderItem={({ item: log }) => (
                                <View
                                    style={[
                                        styles.dayButton,
                                        log.taken && styles.selectedDay
                                    ]}
                                >
                                    <Text style={styles.dayText}>
                                        {getWeekday(log.date)} {"\n"}
                                        {getFormattedDate(log.date)}
                                    </Text>
                                    <Text style={styles.status}>
                                        {log.taken ? "✅" : "❌"}
                                    </Text>
                                </View>
                            )}
                        />

                        <Text style={styles.summary}>
                            ✅ {item.logs.filter((l) => l.taken).length} / {item.logs.length} {t("taken")}
                        </Text>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 2,
        borderColor: '#C6A477',
    },
    week: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444444',
        marginBottom: 8,
    },
    dayButton: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        margin: 5,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#C6A477',
        justifyContent: 'center',
    },
    selectedDay: {
        backgroundColor: '#B5E7A0',
        borderColor: '#8AAD60',
    },
    dayText: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        color: '#444444',
    },
    status: {
        fontSize: 18,
        marginTop: 5,
    },
    summary: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProgressScreen;

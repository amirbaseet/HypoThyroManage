import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';

import ReportsScreen from './ReportsScreen';
import SubmissionHistoryScreen from './SubmissionHistoryScreen';
import ProgressScreen from './ProgressScreen';
import { useTranslation } from 'react-i18next'; // ✅ Import i18n

const Reports = () => {
    const [selectedReport, setSelectedReport] = useState('symptom');
    const { t } = useTranslation(); // ✅ Use translation hook

    const renderSelectedReport = () => {
        switch (selectedReport) {
            case 'symptom':
                return <ReportsScreen />;
            case 'submission':
                return <SubmissionHistoryScreen />;
            case 'progress':
                return <ProgressScreen />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>📋 {t('select_report')}</Text>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        selectedReport === 'symptom' && styles.activeTab
                    ]}
                    onPress={() => setSelectedReport('symptom')}
                >
                    <Text style={styles.tabText}>📝 {t('weekly_symptoms')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        selectedReport === 'submission' && styles.activeTab
                    ]}
                    onPress={() => setSelectedReport('submission')}
                >
                    <Text style={styles.tabText}>📄 {t('form_submissions')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        selectedReport === 'progress' && styles.activeTab
                    ]}
                    onPress={() => setSelectedReport('progress')}
                >
                    <Text style={styles.tabText}>💊 {t('medicine_progress')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {renderSelectedReport()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
        color: '#2c3e50',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#EAE7DC',
        borderWidth: 2,
        borderColor: '#C6A477',
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#C6A477',
    },
    tabText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        padding: 10,
    },
});

export default Reports;

import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';

const PatientVideosScreen = () => {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();



    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.sectionTitle}>{t("video_yonlendir")}</Text>

                <View style={styles.grid}>
                    <TouchableOpacity
                        style={[styles.tileButton, { backgroundColor: '#6D676E' }]}
                        onPress={() => navigation.navigate('Nutrition')}
                    >
                        <Text style={styles.tileText}>{t('nutrition')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tileButton, { backgroundColor: '#7BB661' }]}
                        onPress={() => navigation.navigate('Exercise')}
                    >
                        <Text style={styles.tileText}>{t('exercise')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tileButton, { backgroundColor: '#F4A259' }]}
                        onPress={() => navigation.navigate('Stress')}
                    >
                        <Text style={styles.tileText}>{t('stress')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tileButton, { backgroundColor: '#00B2CA' }]}
                        onPress={() => navigation.navigate('Dermatological')}
                    >
                        <Text style={styles.tileText}>{t('dermatological')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tileButton, { backgroundColor: '#9D84B7' }]}
                        onPress={() => navigation.navigate('Brain')}
                    >
                        <Text style={styles.tileText}>{t('brain')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    container: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginBottom: 15,
        marginTop: 10,
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
    grid: {
        gap: 12,
    },
    tileButton: {
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    tileText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default PatientVideosScreen;

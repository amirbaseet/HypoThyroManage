import React, { useEffect, useContext } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from 'context/AuthContext';
import { useTranslation } from 'react-i18next';

const GreetingScreen = () => {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (user?.role === 'patient') {
                navigation.replace('PatientDrawer');
            } else if (user?.role === 'doctor') {
                navigation.replace('DoctorTabs');
            } else {
                navigation.replace('Drawer');
            }
        }, 2000); // Show greeting for 2 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
    <Image source={require('assets/app-logo.png')} style={styles.logo} />

            <Text style={styles.appName}>HypoThyroManage</Text>
            <Text style={styles.welcome}>
                {t('welcome')}, {user?.username}! 👋
            </Text>
            <ActivityIndicator size="large" color="#003366" style={{ marginTop: 20 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#003366', // 🔵 dark blue
        marginBottom: 10,
    },
    logo: {
        width: 100, // adjust to your needs
        height: 100,
        marginBottom: 20,
        resizeMode: 'contain',
      },
    
    welcome: {
        fontSize: 22,
        fontWeight: '600',
        color: '#444',
        textAlign: 'center',
    },
});

export default GreetingScreen;

import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const navigationOptions = [
    { route: 'Nutrition', icon: 'restaurant-outline', labelKey: 'nutrition' },
    { route: 'Exercise', icon: 'barbell-outline', labelKey: 'exercise' },
    { route: 'Stress', icon: 'pulse-outline', labelKey: 'stress' },
    { route: 'Dermatological', icon: 'leaf-outline', labelKey: 'dermatological' },
    { route: 'Brain', icon: 'bulb-outline', labelKey: 'brain' },
];

const PatientMenuScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useContext(AuthContext);
    const { t } = useTranslation();

    const handleLogout = async () => {
        await logout();
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
        );
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.header}>
                        {user?.username ? `${t('welcome')}, ${user.username}! 👋` : t('welcome')}
                    </Text>

                    <View style={styles.controlsRow}>
                        <View style={styles.langButtonGroup}>
                            <TouchableOpacity
                                style={styles.langButton}
                                onPress={() => i18n.changeLanguage('tr')}
                            >
                                <Text style={styles.langText}>🇹🇷 Türkçe</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.langButton}
                                onPress={() => i18n.changeLanguage('en')}
                            >
                                <Text style={styles.langText}>🇬🇧 English</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={20} color="#fff" />
                            <Text style={styles.logoutText}>{t('logout')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

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
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    langButtonGroup: {
        flexDirection: 'row',
    },
    langButton: {
        backgroundColor: '#C6A477',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginRight: 10,
    },
    langText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#e74c3c',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
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
});

export default PatientMenuScreen;

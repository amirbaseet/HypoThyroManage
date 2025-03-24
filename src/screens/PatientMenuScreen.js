import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Button,
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
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.header}>
                        {user?.username ? `${t('welcome')}, ${user.username}! 👋` : t('welcome')}
                    </Text>

                    <View style={styles.languageButtons}>
                        <Button title="Türkçe 🇹🇷" onPress={() => i18n.changeLanguage('tr')} />
                        <View style={{ width: 10 }} />
                        <Button title="English 🇬🇧" onPress={() => i18n.changeLanguage('en')} />
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#fff" />
                        <Text style={styles.logoutText}>{t('logout')}</Text>
                    </TouchableOpacity>
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
    },
    container: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    topContainer: {
        marginBottom: 25,
        alignItems: 'center',
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
    },
    languageButtons: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#e74c3c',
        paddingHorizontal: 15,
        paddingVertical: 8,
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
        backgroundColor: '#FFFFFF',
        width: '45%',
        paddingVertical: 25,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        borderWidth: 1,
        borderColor: '#EEE',
    },
    cardText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        textAlign: 'center',
    },
});

export default PatientMenuScreen;

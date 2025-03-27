import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { createFormWindow } from '../services/adminService';
import { useTranslation } from 'react-i18next';

const CreateFormWindowScreen = () => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!title.trim()) {
            Alert.alert(t('error'), t('form_window_empty_title'));
            return;
        }

        setLoading(true);
        try {
            const res = await createFormWindow(title);
            if (res.error) {
                Alert.alert(t('error'), res.error);
            } else {
                Alert.alert(t('success'), t('form_window_created'));
                setTitle('');
            }
        } catch (error) {
            Alert.alert(t('error'), t('form_window_create_failed'));
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>{t('form_window_title')}</Text>

                <View style={styles.card}>
                    <TextInput
                        placeholder={t('form_window_placeholder')}
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                        placeholderTextColor="#999"
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.disabledButton]}
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? t('creating') : t('create_form_window')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateFormWindowScreen;

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#FAF9F6',
        paddingTop: 20,
    },
    container: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#444444',
        marginBottom: 25,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFF5E6',
        padding: 20,
        borderRadius: 15,
        borderColor: '#FFD59E',
        borderWidth: 1.5,
        elevation: 2,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
        color: '#333',
    },
    button: {
        backgroundColor: '#C6A477',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.6,
    },
});

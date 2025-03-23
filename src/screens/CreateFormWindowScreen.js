import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { createFormWindow } from '../api/apiService';
import { useTranslation } from 'react-i18next';

const CreateFormWindowScreen = () => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');

    const handleCreate = async () => {
        if (!title.trim()) {
            Alert.alert(t('error'), t('form_window_empty_title'));
            return;
        }

        const res = await createFormWindow(title);
        if (res.error) {
            Alert.alert(t('error'), res.error);
        } else {
            Alert.alert(t('success'), t('form_window_created'));
            setTitle('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>{t('form_window_title')}</Text>

            <TextInput
                placeholder={t('form_window_placeholder')}
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />

            <Button title={t('create_form_window')} onPress={handleCreate} />
        </View>
    );
};

export default CreateFormWindowScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
    },
    heading: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
});

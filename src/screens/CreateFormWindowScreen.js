import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { createFormWindow } from '../api/apiService';

const CreateFormWindowScreen = () => {
    const [title, setTitle] = useState('');

    const handleCreate = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title.');
            return;
        }

        const res = await createFormWindow(title);
        if (res.error) {
            Alert.alert('Error', res.error);
        } else {
            Alert.alert('Success', 'Form window created for this week!');
            setTitle('');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Create Form Window</Text>

            <TextInput
                placeholder="Title (e.g., March Week 3)"
                value={title}
                onChangeText={setTitle}
                style={{ borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 }}
            />

            <Button title="Create Form Window" onPress={handleCreate} />
        </View>
    );
};

export default CreateFormWindowScreen;

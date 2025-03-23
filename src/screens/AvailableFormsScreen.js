import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { getActiveFormWindows } from "../api/apiService";

export default function AvailableFormsScreen({ navigation }) {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        const res = await getActiveFormWindows();
        if (!res.error) {
            setForms(res);
        }
        setLoading(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("SymptomForm", { formWindow: item })}
            style={{ padding: 16, borderBottomWidth: 1 }}
        >
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>{new Date(item.weekStart).toDateString()} → {new Date(item.weekEnd).toDateString()}</Text>
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

    return (
        <FlatList
            data={forms}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No active forms available</Text>}
        />
    );
}

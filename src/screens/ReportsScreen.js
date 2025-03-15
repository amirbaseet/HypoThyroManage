import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getUserReports } from '../api/apiService';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const ReportsScreen = () => {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    

        const userId = user?.id; // 🔹 Get user ID dynamically

    useEffect(() => {
        const fetchReports = async () => {
            const data = await getUserReports(userId);
            setReports(data);
            setLoading(false);
        };
        fetchReports();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#C6A477" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Weekly Reports </Text>
            <FlatList
                data={reports}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.reportCard}>
                        <Text style={styles.week}>📅 Week: {new Date(item.weekStart).toDateString()}</Text>
                        <Text style={styles.symptomTitle}>📝 Symptoms:</Text>
                        <FlatList
                            data={item.symptoms}
                            keyExtractor={(symptom) => symptom.symptomId._id}
                            numColumns={2} // ✅ Show symptoms in a grid format
                            columnWrapperStyle={styles.row}
                            renderItem={({ item: symptom }) => (
                                <View
                                    style={[
                                        styles.symptomButton,
                                        symptom.hasSymptom && styles.selectedSymptom
                                    ]}
                                >
                                    <Text style={styles.symptomText}>
                                        {symptom.symptomId.name} {symptom.hasSymptom }
                                    </Text>
                                </View>
                            )}
                        />
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
    symptomTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#444444',
        marginBottom: 5,
        
    },
    symptomButton: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        margin: 5,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#C6A477',
        justifyContent: 'center',
    },
    selectedSymptom: {
        backgroundColor: '#B5E7A0',
        borderColor: '#8AAD60',
    },
    symptomText: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        color: '#444444',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ReportsScreen;

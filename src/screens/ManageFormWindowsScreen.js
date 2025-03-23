import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  getAllFormWindows,
  toggleFormWindowStatus,
} from '../api/apiService';
import { useTranslation } from 'react-i18next';

const ManageFormWindowsScreen = () => {
  const { t } = useTranslation();
  const [formWindows, setFormWindows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWindows();
  }, []);

  const fetchWindows = async () => {
    setLoading(true);
    const res = await getAllFormWindows();
    if (!res.error) {
      setFormWindows(res);
    } else {
      Alert.alert(t('error'), res.error);
    }
    setLoading(false);
  };

  const handleToggle = async (id) => {
    const res = await toggleFormWindowStatus(id);
    if (res.error) {
      Alert.alert(t('error'), res.error);
    } else {
      fetchWindows();
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>
        🗓️ {new Date(item.weekStart).toDateString()} →{' '}
        {new Date(item.weekEnd).toDateString()}
      </Text>
      <Text>
        {t('status')}: {item.isActive ? t('status_active') : t('status_inactive')}
      </Text>
      <Button
        title={item.isActive ? t('close_form') : t('reopen_form')}
        onPress={() => handleToggle(item._id)}
        color={item.isActive ? 'red' : 'green'}
      />
    </View>
  );

  if (loading)
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  return (
    <FlatList
      data={formWindows}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default ManageFormWindowsScreen;

import React, { useState, useContext } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from "context/AuthContext";
import { resetUserPassword } from "services/adminService";
import { useTranslation } from 'react-i18next';

const AdminResetPasswordScreen = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!phoneNumber || !newPassword) {
      Alert.alert(t('missing_fields_title'), t('missing_fields_msg'));
      return;
    }

    setLoading(true);
    const fullPhone = `+90${phoneNumber}`;
    const response = await resetUserPassword(fullPhone, newPassword);
    setLoading(false);

    if (response.error) {
      Alert.alert(t('error'), response.error);
    } else {
      Alert.alert(t('success'), t('password_reset_success'));
      setPhoneNumber('');
      setNewPassword('');
    }
  };

  if (user?.role !== "admin") {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <Text style={styles.unauthorized}>{t('unauthorized')}</Text>
        <Text style={styles.unauthorizedMsg}>{t('admin_only_access')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{t('reset_user_password')}</Text>

        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <MaterialIcons name='phone' size={20} color='#666' style={styles.icon} />
            <Text style={styles.phonePrefix}>+90</Text>
            <TextInput
              placeholder={t('phone_placeholder')}
              style={styles.input}
              keyboardType='phone-pad'
              value={phoneNumber}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
                setPhoneNumber(cleaned);
              }}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name='lock-closed-outline' size={20} color='#666' style={styles.icon} />
            <TextInput
              placeholder={t('new_password_placeholder')}
              style={styles.input}
              value={newPassword}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
                setNewPassword(cleaned);
              }}
              secureTextEntry
              keyboardType='number-pad'
              maxLength={6}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? t('resetting') : t('reset_password_button')}
            </Text>
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
    gap: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  phonePrefix: {
    fontSize: 16,
    color: '#000',
    paddingRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
  },
  icon: {
    marginRight: 5,
  },
  button: {
    backgroundColor: '#4DA8DA', // Sky Blue
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
  unauthorized: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#444',
    marginTop: 40,
  },
  unauthorizedMsg: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
    marginTop: 10,
  },
});

export default AdminResetPasswordScreen;

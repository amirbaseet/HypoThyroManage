import React, { useState, useContext } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from "../context/AuthContext";
import { resetUserPassword } from "../api/apiService";
import { useTranslation } from 'react-i18next'; // ✅ i18n

const AdminResetPasswordScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation(); // ✅ hook
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (!phoneNumber || !newPassword) {
      Alert.alert(t('missing_fields_title'), t('missing_fields_msg'));
      return;
    }

    const fullPhone = `+90${phoneNumber}`;
    const response = await resetUserPassword(fullPhone, newPassword);

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
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerText}>{t('unauthorized')}</Text>
        <Text style={{ textAlign: 'center', color: 'red', fontSize: 16 }}>
          {t('admin_only_access')}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ paddingHorizontal: 25 }}>
          <Text style={styles.headerText}>{t('reset_user_password')}</Text>

          <View style={styles.inputWrapper}>
            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <MaterialIcons name='phone' size={20} color='#666' style={styles.icon} />
              <Text style={{ fontSize: 16, color: '#000', paddingRight: 5 }}>+90</Text>
              <TextInput
                placeholder={t('phone_placeholder')}
                style={styles.input}
                keyboardType='phone-pad'
                value={phoneNumber}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
                  setPhoneNumber(cleaned);
                }}
              />
            </View>

            {/* New Password */}
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
              />
            </View>

            {/* Reset Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleResetPassword}>
              <Text style={styles.loginButtonText}>{t('reset_password_button')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  headerText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 28,
    fontWeight: '500',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 50,
  },
  inputWrapper: {
    gap: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  loginButton: {
    backgroundColor: '#AD40AF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default AdminResetPasswordScreen;

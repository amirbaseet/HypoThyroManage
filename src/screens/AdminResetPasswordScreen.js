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

const AdminResetPasswordScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (!phoneNumber || !newPassword) {
      Alert.alert('Missing Fields', 'Please fill out all fields.');
      return;
    }

    // if (!/^\d{6}$/.test(newPassword)) {
    //   Alert.alert('Invalid Password', 'Password must be exactly 6 digits.');
    //   return;
    // }

    const fullPhone = `+90${phoneNumber}`;
    const response = await resetUserPassword(fullPhone, newPassword);

    if (response.error) {
      Alert.alert('Error', response.error);
    } else {
      Alert.alert('Success', 'Password reset successfully!');
      setPhoneNumber('');
      setNewPassword('');
    }
  };

  if (user?.role !== "admin") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerText}>Unauthorized</Text>
        <Text style={{ textAlign: 'center', color: 'red', fontSize: 16 }}>
          Only admins can access this screen.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ paddingHorizontal: 25 }}>
          <Text style={styles.headerText}>Reset User Password</Text>

          <View style={styles.inputWrapper}>
            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <MaterialIcons name='phone' size={20} color='#666' style={styles.icon} />
              <Text style={{ fontSize: 16, color: '#000', paddingRight: 5 }}>+90</Text>
              <TextInput
                placeholder='5XXXXXXXXX'
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
                placeholder='Enter new 6-digit PIN'
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
              <Text style={styles.loginButtonText}>Reset Password</Text>
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

import React, { useState } from 'react';
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
import RegImg from 'assets/img/misc/registration.svg';
import GoogleSVG from 'assets/img/misc/google.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { registerUser } from 'services/AuthService'; // or 'api/authApi'

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [role] = useState('patient'); // Default role is patient
    const { t } = useTranslation();

  const handleRegister = async () => {
    if (!phoneNumber || !username || !password || !confirmPassword || !gender) {
      Alert.alert(t("error"), t("error_fill_fields"));
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert(t("error"), t("error_password_match"));
      return;
    }
  
    if (!/^\d{6}$/.test(password)) {
      Alert.alert(t("error"), t("error_pin_length"));
      return;
    }
  
    try {
      const res = await registerUser({
        phoneNumber: `+90${phoneNumber}`,
        username,
        password,
        gender,
        role,
      });
    
      console.log("✅ Register response:", res);
    
      if (res.success) {
        Alert.alert(t("success"), t("success_register"));
        navigation.navigate('Login');
      } else {
        Alert.alert(t("error"), res.error || t("error_register"));
      }
    } catch (e) {
      console.error("❌ Unexpected error during registration:", e);
      Alert.alert(t("error"), e?.message || t("error_register"));
    }
      };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ paddingHorizontal: 25 }}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <RegImg width={300} height={300} style={{ transform: [{ rotate: '-5deg' }] }} />
          </View>

          <Text style={styles.headerText}>{t("register_title")}</Text>

          <View style={styles.inputWrapper}>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <MaterialIcons name='phone' size={20} color='#666' style={styles.icon} />
              <Text style={{ fontSize: 16, color: '#000', paddingRight: 5 }}>+90</Text>
              <TextInput
  placeholder={t("phone_placeholder")}
  style={styles.input}
                keyboardType='phone-pad'
                value={phoneNumber}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
                  setPhoneNumber(cleaned);
                }}
              />
            </View>

            {/* Username */}
            <View style={styles.inputContainer}>
              <MaterialIcons name='person' size={20} color='#666' style={styles.icon} />
              <TextInput
                placeholder={t("username_placeholder")}
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />
            </View>

            {/* Gender Selector */}
            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>{t("select_gender")}</Text>
              <View style={styles.genderOptions}>
                <TouchableOpacity
                  style={[styles.genderButton, gender === 'male' && styles.selectedGender]}
                  onPress={() => setGender('male')}
                >
                  <Text style={[styles.genderText, gender === 'male' && { color: '#fff' }]}>{t("male")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderButton, gender === 'female' && styles.selectedGender]}
                  onPress={() => setGender('female')}
                >
                  <Text style={[styles.genderText, gender === 'female' && { color: '#fff' }]}>{t("female")}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name='lock-closed-outline' size={20} color='#666' style={styles.icon} />
              <TextInput
                placeholder={t("enter_pin")}
                style={styles.input}
                secureTextEntry
                keyboardType='number-pad'
                maxLength={6}
                value={password}
                onChangeText={(text) => setPassword(text.replace(/[^0-9]/g, '').slice(0, 6))}
              />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name='lock-closed-outline' size={20} color='#666' style={styles.icon} />
              <TextInput
                placeholder={t("confirm_pin")}
                style={styles.input}
                secureTextEntry
                keyboardType='number-pad'
                maxLength={6}
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text.replace(/[^0-9]/g, '').slice(0, 6))}
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>{t("register_button")}</Text>
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>{t("or_signup_with")}</Text>
              <View style={styles.line} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialLoginContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <GoogleSVG height={24} width={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.loginContainer}>
              <Text>{t("already_have_account")}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}> {t("login_link")}</Text>
              </TouchableOpacity>
            </View>
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
  registerButton: {
    backgroundColor: '#AD40AF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  orText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  socialButton: {
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  loginText: {
    color: '#AD40AF',
    fontWeight: '700',
  },
  genderContainer: {
    marginTop: 10,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  selectedGender: {
    backgroundColor: '#AD40AF',
  },
  genderText: {
    fontWeight: '600',
    color: '#000',
  },
});

export default RegisterScreen;

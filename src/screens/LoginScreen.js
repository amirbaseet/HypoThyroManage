import React,{useContext,useState} from 'react';
import { View, SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import LogImg from '../../assets/img/misc/login.svg'; 
import GoogleSVG from '../../assets/img/misc/google.svg'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import { useTranslation } from "react-i18next";

const LoginScreen = ({ navigation }) => {
    const { setUser } = useContext(AuthContext); // Get setUser from AuthContext
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const { t } = useTranslation();

    const handleLogin = async () => {
        const res = await loginUser(`+90${phoneNumber}`, password);

        if (res.error) {
            Alert.alert("Error", res.error);
        } else {
            Alert.alert("Success", "Login successful");
            // ✅ Save user & token to AsyncStorage
            await AsyncStorage.setItem("token", res.token);
            await AsyncStorage.setItem("user", JSON.stringify(res.user));

            // ✅ Set user in context
            setUser(res.user);
    
        }
        };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
            <View style={{ paddingHorizontal: 25 }}>
                
                {/* Logo Image */}
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <LogImg width={300} height={300} style={{ transform: [{ rotate: '-5deg' }] }} />
                </View>

                {/* Login Header */}
                <Text style={styles.headerText}>{t("login_title")}</Text>

                {/* Inputs Wrapper */}
                <View style={styles.inputWrapper}>
                    {/* Email Input */}
                    <View style={styles.inputContainer}>
  <MaterialIcons name='phone' size={20} color='#666' style={styles.icon} />
  <Text style={{ fontSize: 16, color: '#000', paddingRight: 5 }}>+90</Text>
  <TextInput
                placeholder={t("phone_placeholder")}
                style={styles.input}
    keyboardType='phone-pad'
    value={phoneNumber}
    onChangeText={(text) => {
      // Only allow digits and limit length to 10
      const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
      setPhoneNumber(cleaned);
    }}
  />
</View>
           {/* Password Input */}
<View style={styles.inputContainer}>
  <Ionicons name='lock-closed-outline' size={20} color='#666' style={styles.icon} />
  <TextInput
                placeholder={t("pin_placeholder")}
                style={styles.input}
    value={password}
    onChangeText={(text) => {
      // Allow only numbers and limit to 6 digits
      const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
      setPassword(cleaned);
    }}
    secureTextEntry
    keyboardType='number-pad'
    maxLength={6} // This ensures it doesn’t go over 6
  />
</View>


                    {/* Login Button */}
                    <TouchableOpacity style={styles.loginButton}  onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>{t("login_button")}</Text>

                    </TouchableOpacity>

                    {/* OR Divider */}
                    <View style={styles.orContainer}>
                    <View style={styles.line} />
                    </View>

                    {/* Social Login Buttons */}
                    <View style={styles.socialLoginContainer}>
                        <TouchableOpacity style={styles.socialButton} onPress={() => console.log("Google Login")}>
                            <GoogleSVG height={24} width={24} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} onPress={() => console.log("Facebook Login")}>
                            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} onPress={() => console.log("Apple Login")}>
                            <Ionicons name="logo-apple" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
            <Text>{t("new_user_prompt")}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> {t("register_link")}</Text>
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
});




export default LoginScreen;

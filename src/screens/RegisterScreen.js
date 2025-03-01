import React, { useState } from 'react';
import { View, SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import RegImg from '../../assets/img/misc/registration.svg'; 
import GoogleSVG from '../../assets/img/misc/google.svg'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

const RegisterScreen = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [dobLabel, setDobLabel] = useState('Date of Birth');

    const onChange = (event, selectedDate) => {
        if (selectedDate) {
            setShowPicker(false);
            setDate(selectedDate);
            setDobLabel(selectedDate.toDateString()); // Format date as a string
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: 25 }}>
                
                {/* Logo Image */}
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <RegImg width={300} height={300} style={{ transform: [{ rotate: '-5deg' }] }} />
                </View>

                {/* Register Header */}
                <Text style={styles.headerText}>Register Screen</Text>

                {/* Inputs Wrapper */}
                <View style={styles.inputWrapper}>
                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <MaterialIcons name='alternate-email' size={20} color='#666' style={styles.icon} />
                        <TextInput
                            placeholder='Email ID'
                            style={styles.input}
                            keyboardType='email-address'
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name='ios-lock-closed-outline' size={20} color='#666' style={styles.icon} />
                        <TextInput
                            placeholder='Password'
                            style={styles.input}
                            secureTextEntry={true}
                        />
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name='ios-lock-closed-outline' size={20} color='#666' style={styles.icon} />
                        <TextInput
                            placeholder='Confirm Password'
                            style={styles.input}
                            secureTextEntry={true}
                        />
                    </View>

                    {/* Date of Birth Picker (Expo Compatible) */}
                    <TouchableOpacity style={styles.inputContainer} onPress={() => setShowPicker(true)}>
                        <Ionicons name="calendar-outline" size={20} color='#666' style={styles.icon} />
                        <Text style={[styles.input, { paddingVertical: 10, color: dobLabel === 'Date of Birth' ? '#888' : '#000' }]}>
                            {dobLabel}
                        </Text>
                    </TouchableOpacity>

                    {showPicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            maximumDate={new Date('2005-01-01')}
                            minimumDate={new Date('1980-01-01')}
                            onChange={onChange}
                        />
                    )}

                    {/* Register Button */}
                    <TouchableOpacity style={styles.registerButton}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>

                    {/* OR Divider */}
                    <View style={styles.orContainer}>
                        <View style={styles.line} />
                        <Text style={styles.orText}>Or, sign up with...</Text>
                        <View style={styles.line} />
                    </View>

                    {/* Social Sign-Up Buttons */}
                    <View style={styles.socialLoginContainer}>
                        <TouchableOpacity style={styles.socialButton} onPress={() => console.log("Google Sign-Up")}>
                            <GoogleSVG height={24} width={24} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} onPress={() => console.log("Facebook Sign-Up")}>
                            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} onPress={() => console.log("Apple Sign-Up")}>
                            <Ionicons name="logo-apple" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Navigate to Login */}
                <View style={styles.loginContainer}>
                    <Text>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginText}> Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
});

export default RegisterScreen;

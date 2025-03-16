import RNRSA from 'react-native-rsa-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Generate RSA Key Pair (Public & Private)
export const generateRSAKeyPair = async () => {
    const keys = await RNRSA.generateKeys(2048); // 2048-bit RSA keys
    await AsyncStorage.setItem("privateKey", keys.private); // Store Private Key Locally
    await AsyncStorage.setItem("publicKey", keys.public);   // Store Public Key Locally
    return keys;
};

// ✅ Retrieve RSA Keys from Storage
export const getRSAKeys = async () => {
    const privateKey = await AsyncStorage.getItem("privateKey");
    const publicKey = await AsyncStorage.getItem("publicKey");
    return { privateKey, publicKey };
};

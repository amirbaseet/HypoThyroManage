import * as SecureStore from "expo-secure-store";

// ✅ Save Private Key Securely
export async function savePrivateKey(privateKey) {
    await SecureStore.setItemAsync("privateKey", privateKey);
}

// ✅ Retrieve Private Key
export async function getPrivateKey() {
    return await SecureStore.getItemAsync("privateKey");
}

// ✅ Clear Private Key (on logout)
export async function clearPrivateKey() {
    await SecureStore.deleteItemAsync("privateKey");
}

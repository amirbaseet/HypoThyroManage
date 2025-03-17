import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import api,{ updatePushToken } from "../api/apiService";
// import { saveUserToLocalDB } from "../database/UsersCrud";
import * as Notifications from "expo-notifications";

const fileName = `IN AuthService`;

export const loginUser = async (email, password) => {
    try {
        const res = await api.post(`/auth/login`, { email, password });
        const token = res.data.token;
        const decoded = jwtDecode(token);

        const user = {
            id: decoded.id,
            username: decoded.username || "Unknown",
            email: decoded.email || "No email",
            dateOfBirth: decoded.dateOfBirth || "2000-01-01",
            gender: decoded.gender || "Unknown",
            doctorId: decoded.doctorId || null,
            role: decoded.role || "User",
        };

        // 🔹 Store both token & user details in AsyncStorage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        // 🔹 Fetch Expo Push Token with Error Handling
        let pushToken = null;
        try {
            const { data } = await Notifications.getExpoPushTokenAsync();
            pushToken = data;
            console.log("Expo Push Token:", pushToken);
            await updatePushToken( user.id, pushToken);
                    } catch (pushError) {
            console.error("Error fetching Expo push token:", pushError.message);
        }

        return { token, user };
    } catch (error) {
        console.error(`${fileName} Login Error:`, error.response?.data || error.message);
        return { error: error.response?.data?.message || "Login failed" };
    }
};
export const logoutUser = async()=>{
    console.log(`${fileName} Logging out...`);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user"); // 🔹 Also remove user data
};

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define base URL for API (use environment variables for flexibility)
const ip = "10.7.84.67";  // Replace with your machine's local network IP

const API_URL = `http://${ip}:3001/api`;
// Create an axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add an interceptor to include the token in every request
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export const updatePushToken = async (userId, pushToken) => {
    try{
        if(!pushToken){
            console.log("❌ Error: Push token is Missing");
            return { error: "Push token is required" };
        }

        const response = await api.post(`/auth/update-push-token`, { userId, pushToken });
        return response.data;
    }catch(error){
        console.error("❌ Error updating push token:", error.response?.data || error);
        return { error: error.response?.data?.message || "Failed to update push token" };
    }
};

// ✅ Remove Push Token (when logging out)
export const removePushToken = async (userId) => {
    try {
        if (!userId) {
            console.log("❌ Error: User ID is required to remove push token");
            return { error: "User ID is required" };
        }

        const response = await api.post(`/auth/remove-push-token`, { userId });
        return response.data;
    } catch (error) {
        console.error("❌ Error removing push token:", error.response?.data || error);
        return { error: error.response?.data?.message || "Failed to remove push token" };
    }
};



// ✅ Register a New User
export const registerUser = async (name, email, password) => {
    try {
        const response = await api.post(`/auth/register`, { name, email, password });
        return response.data;
    } catch (error) {
        console.error("❌ Error registering user:", error);
        return { error: error.response?.data?.message || "Registration failed" };
    }
};



export default api;
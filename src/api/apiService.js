import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define base URL for API (use environment variables for flexibility)
const ip = "10.7.84.67";
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

export default api;

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "../services/AuthService"; // Make sure path is correct
import { API_URL } from "@env";  // 🔥 Import from .env


// Create an axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Attach token to every request
api.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // ✅ Handle 401/403 responses
  api.interceptors.response.use(
    response => response,
    async error => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        await logoutUser();
      }
      return Promise.reject(error);
    }
  );
      




export default api;
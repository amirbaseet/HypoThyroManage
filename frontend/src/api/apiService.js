import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "services/AuthService"; // Make sure path is correct
import { API_URL } from "@env";  // 🔥 Import from .env
import { Alert } from "react-native"; // or use Toast from a UI library
import { useTranslation } from "react-i18next";
import i18n from "../i18n"; // adjust this to your actual i18n.js path
import Toast from 'react-native-toast-message';

// Define base URL for API (use environment variables for flexibility)

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
      }else if (error.message === "Network Error" || !error.response) {
      // 🔥 Handle server down or no internet
         // 🔥 Show toast for connection issues
      Toast.show({
        type: 'error',
        text1: i18n.t("Connection_Error"),
        text2: i18n.t("Connection_Error_Body"),
      });
    }

      return Promise.reject(error);
    }
  );
export default api;
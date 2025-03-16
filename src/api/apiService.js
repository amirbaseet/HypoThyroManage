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



export const getDoctorPatientsReports = async (doctorId) => {
    try {
        const response = await api.get(`/reports/doctor/${doctorId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching doctor reports:", error.response?.data || error);
        return { patients: [], reports: [] };
    }
};

// ✅ Get Symptoms
export const getSymptoms = async () => {
    try {
        const response = await api.get(`/symptoms`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching symptoms:", error);
        return [];
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

// ✅ Submit Weekly Report
export const submitWeeklyReport = async (userId, symptoms) => {
    try {
        // Ensure symptoms is an array
        if (!Array.isArray(symptoms) || symptoms.length === 0) {
            console.error("❌ Error: Symptoms should be a non-empty array");
            return { error: "Please select at least one symptom." };
        }

        // Send POST request to backend
        const response = await axios.post(`${API_URL}/reports/submit-report`, { userId, symptoms });
        return response.data;
    } catch (error) {
        console.error("❌ Error submitting weekly report:", error.response?.data || error);
        return { error: error.response?.data?.message || "Report submission failed" };
    }
};

// ✅ Get All Reports for a User
export const getUserReports = async (userId) => {
    try {
        const response = await api.get(`/reports/${userId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching reports:", error);
        return [];
    }
};

// ✅ Get the Latest Weekly Report
export const getLatestReport = async (userId) => {
    try {
        const response = await api.get(`/reports/latest-report/${userId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching latest report:", error);
        return null;
    }
};
// Send a message
export const sendMessageAPI = async (senderId, receiverId, message) => {
    try {
        const res = await api.post("/messages/send", { senderId, receiverId, message });
        return res.data;
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

// Get chat history
export const getChatHistoryAPI = async (user1, user2) => {
    try {
        const res = await api.post("/messages/chatHistory", { user1, user2 });
        return res.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return [];
    }
};


export default api;

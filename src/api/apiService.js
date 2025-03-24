import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define base URL for API (use environment variables for flexibility)
const ip = "172.20.10.4";  // Replace with your machine's local network IP

const API_URL = `http://${ip}:3001/api`;
// Create an axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add an interceptor to include the token in every request
api.interceptors.response.use(
    (response) => response, // If the response is fine, return it
    async (error) => {
        const originalRequest = error.config;

        // Check if it's an Unauthorized error AND we haven't retried this request before
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // ✅ Update the Authorization header with the new token
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                    // ✅ Retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Error refreshing token:", refreshError);
            }
        }

        return Promise.reject(error); // If refresh failed or it's another error
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


// Get active form windows (for patients)
export const getActiveFormWindows = async () => {
    try {
        const response = await api.get("/patient/form-windows/active");
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching active windows:", error);
        return { error: "Could not fetch form windows" };
    }
};

// Submit symptom form
export const submitSymptomForm = async (formWindowId, symptoms) => {
    try {
        const response = await api.post("/patient/form-submissions", {
            formWindowId,
            symptoms
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error submitting form:", error.response?.data || error);
        return { error: error.response?.data?.message || "Submission failed" };
    }
};

// Admin: Create new form window
export const createFormWindow = async (title, weekStart, weekEnd) => {
    try {
        const response = await api.post("/admin/form-windows", {
            title,
            weekStart,
            weekEnd
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error creating form window:", error.response?.data || error);
        return { error: error.response?.data?.message || "Creation failed" };
    }
};

// Admin: Toggle form window status
export const toggleFormWindowStatus = async (id) => {
    try {
        const response = await api.patch(`/admin/form-windows/${id}/toggle`);
        return response.data;
    } catch (error) {
        console.error("❌ Error toggling status:", error.response?.data || error);
        return { error: error.response?.data?.message || "Failed to toggle status" };
    }
};

// Admin: Get all form windows
export const getAllFormWindows = async () => {
    try {
        const response = await api.get("/admin/form-windows");
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching all windows:", error.response?.data || error);
        return { error: error.response?.data?.message || "Failed to fetch windows" };
    }
};
// Refresh Token 
export const refreshAccessToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) return null;

        const response = await api.post("/auth/refresh-token", { refreshToken });
        const { accessToken } = response.data;

        if (accessToken) {
            await AsyncStorage.setItem("token", accessToken);
            return accessToken;
        }
        return null;
    } catch (error) {
        console.error("Refresh Token Error:", error.response?.data || error.message);
        return null;
    }
};




export default api;
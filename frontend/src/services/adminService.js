import api from "api/apiService";
import { API_ROUTES } from 'constants/apiRoutes';
const fileName = `IN adminService`;

export const sendToAllNotifications = async (title, message) => {
    try {
        // const response = await api.post("/notifications/send-to-all", { title, message });
        const response = await api.post(API_ROUTES.SEND_TO_ALL_NOTIFICATIONS, { title, message });
        return response.data;
    } catch (error) {
        console.error(fileName,"❌ Error sending notification:", error.response?.data || error);
        return { error: error.response?.data?.message || "Failed to send notification" };
    }
};
export const resetUserPassword = async (phoneNumber, newPassword) => {
    try {
        // const response = await api.post(`/auth/admin/reset-password`, {
        const response = await api.post(API_ROUTES.RESET_PASSWORD, {
            phoneNumber,
            newPassword,
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error resetting password:", error.response?.data || error);
        return { error: error.response?.data?.message || "Failed to reset password" };
    }
};



// Admin: Create new form window
export const createFormWindow = async (title, symptomSeverityFormLink, copingScaleFormLink) => {
    try {
        // const res = await api.post('/admin/form-windows', {
        const res = await api.post(API_ROUTES.CREATE_FORM_WINDOW, {
            title,
            symptomSeverityFormLink,
            copingScaleFormLink
        });
        return res.data;
    } catch (error) {
        console.error("❌ Error creating form window:", error.response?.data || error.message);
        return { error: error.response?.data?.message || "Failed to create form window" };
    }
};

// Admin: Toggle form window status
export const toggleFormWindowStatus = async (id) => {
    try {
        // const response = await api.patch(`/admin/form-windows/${id}/toggle`);
        const response = await api.patch(API_ROUTES.TOGGLE_FORM_WINDOW_STATUS(id));
        return response.data;
    } catch (error) {
        console.error("❌ Error toggling status:", error.response?.data || error);
        return { error: error.response?.data?.message || "Failed to toggle status" };
    }
};

// Admin: Get all form windows
export const getAllFormWindows = async () => {
    try {
        // const response = await api.get("/admin/form-windows");
        const response = await api.get(API_ROUTES.GET_ALL_FORM_WINDOWS);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching all windows:", error.response?.data || error);
        return { error: error.response?.data?.message || "Failed to fetch windows" };
    }
};
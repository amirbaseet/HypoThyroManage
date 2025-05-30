import api from "api/apiService";
const fileName = `IN adminService`;

export const sendToAllNotifications = async (title, message) => {
    try {
        const response = await api.post("/notifications/send-to-all", { title, message });
        return response.data;
    } catch (error) {
        console.error(fileName,"❌ Error sending notification:", error.response?.data || error);
        return { error: error.response?.data?.message || "Failed to send notification" };
    }
};
export const resetUserPassword = async (phoneNumber, newPassword) => {
    try {
        const response = await api.post(`/auth/admin/reset-password`, {
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
        const res = await api.post('/admin/form-windows', {
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
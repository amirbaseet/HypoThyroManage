import api from "../api/apiService";
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

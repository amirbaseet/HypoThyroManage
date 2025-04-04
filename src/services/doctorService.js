import api from "../api/apiService";
const fileName = `IN doctorService`;

export const getDoctorPatientsReports = async (doctorId) => {
    try {
        const response = await api.get(`/reports/doctor/${doctorId}`);
        return response.data;
    } catch (error) {
        console.error(fileName,"❌ Error fetching doctor reports:", error.response?.data || error);
        return { patients: [], reports: [] };
    }
};

export const getDoctorChatListAPI = async () => {
    try {
        const response = await api.get(`/messages/doctor-chats`); // ✅ Ensure the correct endpoint
        return response.data;
    } catch (error) {
        console.error(fileName,"❌ Error fetching chat list:", error.response?.data || error);
        return [];
    }
};

export const getMissedMedicineUsers = async () => {
    try {
        const response = await api.get(`/medicine/missed-medicine-users`);
        return response.data.missedUsers;
    } catch (error) {
        console.error("❌ Error fetching missed medicine users:", error.response?.data || error);
        return [];
    }
};

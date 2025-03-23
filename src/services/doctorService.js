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
        console.error("❌ Error fetching chat list:", error.response?.data || error);
        return [];
    }
};
export const getDoctorSymptomSubmissions = async () => {
    try {
        const res = await api.get("/patient/doctor/submissions");
        return res.data;
    } catch (error) {
        console.error("❌ Error fetching doctor form submissions:", error.response?.data || error);
        return { patients: [], submissions: [] };
    }
};
import api from "api/apiService";
const fileName = `IN doctorService`;
import { API_ROUTES } from 'constants/apiRoutes';

export const getDoctorPatientsReports = async (doctorId) => {
    try {
        // const response = await api.get(`/reports/doctor/${doctorId}`);
        const response = await api.get(API_ROUTES.GET_DOCTOR_REPORTS(doctorId));
        return response.data;
    } catch (error) {
        console.error(fileName,"❌ Error fetching doctor reports:", error.response?.data || error);
        return { patients: [], reports: [] };
    }
};

export const getDoctorChatListAPI = async () => {
    try {
        // const response = await api.get(`/messages/doctor-chats`); 
        const response = await api.get(API_ROUTES.GET_DOCTOR_CHAT_LIST); 
        return response.data;
    } catch (error) {
        console.error(fileName,"❌ Error fetching chat list:", error.response?.data || error);
        return [];
    }
};

export const getMissedMedicineUsers = async () => {
    try {
        // const response = await api.get(`/medicine/missed-medicine-users`);
        const response = await api.get(API_ROUTES.GET_MISSED_MEDICINE_USERS);
        return response.data.missedUsers;
    } catch (error) {
        console.error("❌ Error fetching missed medicine users:", error.response?.data || error);
        return [];
    }
};

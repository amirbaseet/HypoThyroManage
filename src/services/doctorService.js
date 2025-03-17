import api from "../api/apiService";

export const getDoctorPatientsReports = async (doctorId) => {
    try {
        const response = await api.get(`/reports/doctor/${doctorId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching doctor reports:", error.response?.data || error);
        return { patients: [], reports: [] };
    }
};

import api from "../api/apiService";

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

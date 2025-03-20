import api from "../api/apiService";
const fileName = `IN symptomService`;

// ✅ Get Symptoms
export const getSymptoms = async () => {
    try {
        const response = await api.get(`/symptoms`);
        return response.data;
    } catch (error) {
        console.error(fileName,"❌ Error fetching symptoms:", error);
        return [];
    }
};

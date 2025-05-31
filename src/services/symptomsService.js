import api from "api/apiService";
const fileName = `IN symptomService`;
import { API_ROUTES } from 'constants/apiRoutes';

// ✅ Get Symptoms
export const getSymptoms = async () => {
    try {
        // const response = await api.get(`/symptoms`);
        const response = await api.get(API_ROUTES.GET_SYMPTOMS);
        return response.data;
    } catch (error) {
        console.error(fileName,"❌ Error fetching symptoms:", error);
        return [];
    }
};

import api from "api/apiService";
const fileName = `IN medicineService`;
import { API_ROUTES } from 'constants/apiRoutes';

// ✅ Mark today's medicine as taken
export const markMedicineAsTaken = async (taken = true) => {
    try {
        // const res = await api.post("/medicine/take", { taken });
        const res = await api.post(API_ROUTES.MARK_MEDICINE_TAKEN, { taken });
        return res.data;
    } catch (error) {
        console.error("❌ markMedicineAsTaken error:", error.response?.data);
        return { error: error.response?.data?.message || "Something went wrong" };
    }
};
// ✅ Get medicine progress
export const getWeeklyProgress = async (userId = null) => {
    try {
        // const response = await api.get("/medicine/progress", {
        const response = await api.get(API_ROUTES.GET_WEEKLY_PROGRESS, {
            params: userId ? { userId } : {} // 👈 only add param if it's passed
        });
        return response.data; // returns { weeks: [...] }
    } catch (error) {
        console.error("❌ Error fetching weekly progress:", error.response?.data || error);
        return { error: "Could not fetch progress" };
    }
};

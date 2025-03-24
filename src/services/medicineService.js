import api from "../api/apiService";
const fileName = `IN medicineService`;

// ✅ Mark today's medicine as taken
export const markMedicineAsTaken = async () => {
    try {
        const response = await api.post("/medicine/take");
        return response.data;
    } catch (error) {
        console.error(fileName,"❌ Error taking medicine:", error.response?.data || error);
        return { error: error.response?.data?.message || "Failed to mark as taken" };
    }
};

// ✅ Get medicine progress
export const getWeeklyProgress = async (userId = null) => {
    try {
        const response = await api.get("/medicine/progress", {
            params: userId ? { userId } : {} // 👈 only add param if it's passed
        });
        return response.data; // returns { weeks: [...] }
    } catch (error) {
        console.error("❌ Error fetching weekly progress:", error.response?.data || error);
        return { error: "Could not fetch progress" };
    }
};

import api from "../api/apiService";
const fileName = `IN patientService`;

// ✅ Submit Weekly Report
export const submitWeeklyReport = async (userId, symptoms) => {
    try {
        // Ensure symptoms is an array
        if (!Array.isArray(symptoms) || symptoms.length === 0) {
            console.error(fileName,"❌ Error: Symptoms should be a non-empty array");
            return { error: "Please select at least one symptom." };
        }

        // Send POST request to backend
        const response = await api.patch(`/reports/submit-report`, { userId, symptoms });
        return response.data;
    } catch (error) {
        console.error("❌ Error submitting weekly report:", error.response?.data || error);
        return { error: error.response?.data?.message || "Report submission failed" };
    }
};

// ✅ Get All Reports for a User
export const getUserReports = async (userId) => {
    try {
        const response = await api.get(`/reports/${userId}`);
        return response.data;
    } catch (error) {
        console.error(fileName,"❌ Error fetching reports:", error);
        return [];
    }
};

// ✅ Get the Latest Weekly Report
export const getLatestReport = async (userId) => {
    try {
        const response = await api.get(`/reports/latest-report/${userId}`);
        return response.data;
    } catch (error) {
        console.error(fileName,"❌ Error fetching latest report:", error);
        return null;
    }
};

export const getLatestWeeklyReport = async (userId) => {
    try {
        const response = await api.get(`/reports/latest-report/${userId}`);
        return response.data; // Return only the data
    } catch (error) {
        console.error(fileName,"Error fetching latest report:", error.response?.data || error.message);
        return null;
    }
};

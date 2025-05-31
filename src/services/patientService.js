import api from "api/apiService";
const fileName = `IN patientService`;
import { API_ROUTES } from 'constants/apiRoutes';

// ✅ Submit Weekly Report
export const submitWeeklyReport = async (userId, symptoms) => {
    try {
        // Ensure symptoms is an array
        if (!Array.isArray(symptoms) || symptoms.length === 0) {
            console.error(fileName,"❌ Error: Symptoms should be a non-empty array");
            return { error: "Please select at least one symptom." };
        }

        // Send POST request to backend
        // const response = await api.patch(`/reports/submit-report`, { userId, symptoms });
        const response = await api.patch(API_ROUTES.SUBMIT_WEEKLY_REPORT, { userId, symptoms });
        return response.data;
    } catch (error) {
        console.error("❌ Error submitting weekly report:", error.response?.data || error);
        return { error: error.response?.data?.message || "Report submission failed" };
    }
};

// ✅ Get All Reports for a User
export const getUserReports = async (userId) => {
    try {
        // const response = await api.get(`/reports/${userId}`);
        const response = await api.get(API_ROUTES.GET_USER_REPORTS(userId));
        return response.data;
    } catch (error) {
        console.error(fileName,"❌ Error fetching reports:", error);
        return [];
    }
};



export const getLatestWeeklyReport = async (userId) => {
    try {
        // const response = await api.get(`/reports/latest-report/${userId}`);
        const response = await api.get(API_ROUTES.GET_LATEST_WEEKLY_REPORT(userId));
        return response.data; // Return only the data
    } catch (error) {
        console.error(fileName,"Error fetching latest report:", error.response?.data || error.message);
        return null;
    }
};

// ✅ Get previous submission (for this form)
export const getLatestSymptomForm = async (userId, formWindowId) => {
    try {
        // const res = await api.get(`/patient/form-submissions/latest`, {
        const res = await api.get(API_ROUTES.GET_LATEST_SYMPTOM_FORM, {
            params: { userId, formWindowId }
        });
        return res.data;
    } catch (error) {
        return null; // fine if none exists
    }
};
// ✅ Submit or update the form
export const submitSymptomForm = async (formWindowId, symptoms, copingResponses) => {
    try {
        // const res = await api.patch(`/patient/form-submissions`, {
        const res = await api.patch(API_ROUTES.SUBMIT_SYMPTOM_FORM, {
            formWindowId,
            symptoms,
            copingResponses
        });
        return res.data;
    } catch (error) {
        console.error("❌ submitSymptomForm error:", error.response?.data || error.message);
        return { error: error.response?.data?.message || "Submission failed" };
    }
};
export const getLatestCopingForm = async (userId, formWindowId) => {
    try {
        // const res = await api.get(`/patient/coping`, {
        const res = await api.get(API_ROUTES.GET_LATEST_COPING_FORM, {
            params: { userId, formWindowId }
        });
        return res.data; // ✅ CORRECT
            } catch (error) {
        console.error("Failed to fetch coping form:", error);
        return null;
    }
};
export const getPatientUnreadMessageCount = async (patientId) => {
    // const response = await api.get(`/messages/unread-count?userId=${patientId}`);
    const response = await api.get(API_ROUTES.GET_UNREAD_MESSAGE_COUNT(patientId));
    return response.data;
  };

  // Get active form windows (for patients)
export const getActiveFormWindows = async () => {
    try {
        // const response = await api.get("/patient/form-windows/active");
        const response = await api.get(API_ROUTES.GET_ACTIVE_FORM_WINDOWS);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching active windows:", error);
        return { error: "Could not fetch form windows" };
    }
};
// Get form submissions for a specific user
export const getFormSubmissions = async (userId) => {
    try {
    //   const response = await api.get('/patient/form-submissions', {
      const response = await api.get(API_ROUTES.GET_FORM_SUBMISSIONS, {
        params: { userId },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error fetching form submissions:", error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch submissions",
      };
    }
  };
  
  
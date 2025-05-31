import api from 'api/apiService';
const updatePushTokenPath = `/auth/update-push-token`;
import { API_ROUTES } from 'constants/apiRoutes';

export const updatePushToken = async (userId, pushToken) => {
    try{
        if(!pushToken){
            console.log("❌ Error: Push token is Missing");
            return { error: "Push token is required" };
        }

        // const response = await api.post(`/auth/update-push-token`, { userId, pushToken });
        const response = await api.post(API_ROUTES.UPDATE_PUSH_TOKEN, { userId, pushToken });
        return response.data;
    }catch(error){
        console.error("❌ Error updating push token:", error.response?.data || error);
        return { error: error.response?.data?.message || "Failed to update push token" };
    }
};

// ✅ Remove Push Token (when logging out)
export const removePushToken = async (userId) => {
    try {
        if (!userId) {
            console.log("❌ Error: User ID is required to remove push token");
            return { error: "User ID is required" };
        }

        // const response = await api.post(`/auth/remove-push-token`, { userId });
        const response = await api.post(API_ROUTES.REMOVE_PUSH_TOKEN, { userId });
        return response.data;
    } catch (error) {
        console.error("❌ Error removing push token:", error.response?.data || error);
        return { error: error.response?.data?.message || "Failed to remove push token" };
    }
};

import api from "api/apiService";
import { API_ROUTES } from 'constants/apiRoutes';

const fileName = `IN chatService`;

// Send a message
export const sendMessageAPI = async (senderId, receiverId, message) => {
    try {
        // const res = await api.post("/messages/send", { senderId, receiverId, message });
        const res = await api.post(API_ROUTES.SEND_MESSAGE, { senderId, receiverId, message });
        // console.log("✅ Message sent and stored:", res.data);
        return res.data;
    } catch (error) {
        console.error("❌ Error sending message:", error);
    }
};

// Get chat history
export const getChatHistoryAPI = async (user1, user2) => {
    try {
        // const res = await api.post("/messages/chatHistory", { user1, user2 });
        const res = await api.post(API_ROUTES.GET_CHAT_HISTORY, { user1, user2 });
        return res.data;
    } catch (error) {
        console.error(fileName,"Error fetching chat history:", error);
        return [];
    }
};

// Mark Messages as Read API
export const markMessagesAsReadAPI = async (senderId, receiverId) => {
    try {
        // const res = await api.post("/messages/markAsRead", { senderId, receiverId });
        const res = await api.post(API_ROUTES.MARK_MESSAGES_READ, { senderId, receiverId });

        // console.log("✅ Messages marked as read response:", res.data);
        // console.log("✅ Messages marked as read response:");
        return res.data;
    } catch (error) {
        console.error(fileName,"❌ Error marking messages as read:", error);
    }
};

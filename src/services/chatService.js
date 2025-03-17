import api from "../api/apiService";
// Send a message
export const sendMessageAPI = async (senderId, receiverId, message) => {
    try {
        const res = await api.post("/messages/send", { senderId, receiverId, message });
        return res.data;
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

// Get chat history
export const getChatHistoryAPI = async (user1, user2) => {
    try {
        const res = await api.post("/messages/chatHistory", { user1, user2 });
        return res.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return [];
    }
};
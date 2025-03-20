const express = require("express");
const { sendMessage, getChatHistory ,markMessagesAsRead, getDoctorChatList } = require("../controllers/messageController");
const verifyToken = require("../middlewares/authMiddleware")

const router = express.Router();

// Send a message
router.post("/send",verifyToken, sendMessage);

// Get chat history between two users
router.post("/chatHistory",verifyToken, getChatHistory);

router.post("/markAsRead",verifyToken, markMessagesAsRead)
// ✅ Fetch chat list for doctor
router.get("/doctor-chats", verifyToken, getDoctorChatList);

module.exports = router;

const express = require("express");
const { sendMessage, getChatHistory ,markMessagesAsRead, getDoctorChatList, getPatientUnreadMessageCount  } = require("../controllers/messageController");
const verifyToken = require("../middlewares/authMiddleware")

const router = express.Router();

// Send a message
router.post("/send",verifyToken, sendMessage);

// Get chat history between two users
router.post("/chatHistory",verifyToken, getChatHistory);
// mark messeges as read 
router.post("/markAsRead",verifyToken, markMessagesAsRead)
// ✅ Fetch chat list for doctor
router.get("/doctor-chats", verifyToken, getDoctorChatList);
// 🔴 Get unread message count for patient (for red dot)
router.get("/unread-count", verifyToken, getPatientUnreadMessageCount);

module.exports = router;

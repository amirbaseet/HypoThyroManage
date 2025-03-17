const express = require("express");
const { sendMessage, getChatHistory } = require("../controllers/messageController");
const verifyToken = require("../middlewares/authMiddleware")

const router = express.Router();

// Send a message
router.post("/send",verifyToken, sendMessage);

// Get chat history between two users
router.post("/chatHistory",verifyToken, getChatHistory);

module.exports = router;

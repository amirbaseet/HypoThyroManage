const express = require("express");
const { sendMessage, getChatHistory } = require("../controllers/messageController");

const router = express.Router();

// Send a message
router.post("/send", sendMessage);

// Get chat history between two users
router.post("/chatHistory", getChatHistory);

module.exports = router;

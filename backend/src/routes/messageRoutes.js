const express = require("express");
const { sendMessage, getChatHistory ,markMessagesAsRead, getDoctorChatList, getPatientUnreadMessageCount  } = require("../controllers/messageController");
const verifyToken = require("../middlewares/authMiddleware")

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messaging
 *   description: Chat functionality between doctors and patients
 */

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send an encrypted message (only between doctor and their assigned patient)
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *                 description: The authenticated user's ID (doctor or patient)
 *               receiverId:
 *                 type: string
 *                 description: The other participant's ID (must be doctor or patient in the correct relationship)
 *               message:
 *                 type: string
 *             required:
 *               - senderId
 *               - receiverId
 *               - message
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Unauthorized (invalid sender/receiver relationship)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

// Send a message
router.post("/send",verifyToken, sendMessage);
/**
 * @swagger
 * /api/messages/chatHistory:
 *   post:
 *     summary: Get chat history between a doctor and an assigned patient (decrypted)
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user1:
 *                 type: string
 *                 description: User ID of one participant (doctor or patient)
 *               user2:
 *                 type: string
 *                 description: User ID of the other participant (doctor or patient)
 *             required:
 *               - user1
 *               - user2
 *     responses:
 *       200:
 *         description: Chat history between doctor and assigned patient
 *       400:
 *         description: Missing or invalid user IDs
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

// Get chat history between two users
router.post("/chatHistory",verifyToken, getChatHistory);
/**
 * @swagger
 * /api/messages/markAsRead:
 *   post:
 *     summary: Mark messages as read in a doctor-patient conversation
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *                 description: ID of the message sender (doctor or patient)
 *               receiverId:
 *                 type: string
 *                 description: ID of the message receiver (doctor or patient)
 *             required:
 *               - senderId
 *               - receiverId
 *     responses:
 *       200:
 *         description: Messages marked as read
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
// mark messeges as read 
router.post("/markAsRead",verifyToken, markMessagesAsRead)
/**
 * @swagger
 * /api/messages/doctor-chats:
 *   get:
 *     summary: Get doctor's chat list with patients (last message and unread count)
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chat summaries for doctor
 *       400:
 *         description: Doctor ID missing
 *       500:
 *         description: Server error fetching chat list
 */
// ✅ Fetch chat list for doctor
router.get("/doctor-chats", verifyToken, getDoctorChatList);
/**
 * @swagger
 * /api/messages/unread-count:
 *   get:
 *     summary: Get unread message count for a patient (for red dot indicator)
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The patient's userId
 *     responses:
 *       200:
 *         description: Count of unread messages
 *       500:
 *         description: Error fetching unread count
 */
// 🔴 Get unread message count for patient (for red dot)
router.get("/unread-count", verifyToken, getPatientUnreadMessageCount);

module.exports = router;

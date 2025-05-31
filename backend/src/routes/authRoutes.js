const express = require('express');
const {register,login, resetUserPassword, logout, updatePushToken, removePushToken, refreshTokenHandler } = require('../controllers/authController')
const router =express.Router();
const verifyToken = require("../middlewares/authMiddleware")
const authorizeRoles = require("../middlewares/roleMiddleware")
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: Must be exactly 6 digits
 *               gender:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, doctor, patient]
 *               adminKey:
 *                 type: string
 *                 description: Required if creating an admin account
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Unauthorized to create admin
 */
router.post("/register", register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Logout failed
 */
router.post("/logout", verifyToken, logout);

/**
 * @swagger
 * /api/auth/update-push-token:
 *   post:
 *     summary: Update a user's Expo push token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               pushToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Push token updated successfully
 *       400:
 *         description: Missing parameters
 *       500:
 *         description: Server error
 */
// Update user's Expo push token
router.post("/update-push-token",verifyToken, updatePushToken);
/**
 * @swagger
 * /api/auth/remove-push-token:
 *   post:
 *     summary: Remove a user's Expo push token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Push token removed successfully
 *       400:
 *         description: Missing userId
 *       500:
 *         description: Server error
 */
// Remove push token (on logout)
router.post("/remove-push-token", verifyToken, removePushToken);

/**
 * @swagger
 * /api/auth/admin/reset-password:
 *   post:
 *     summary: Reset a user's password (Admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 description: Must be exactly 6 digits
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid password format
 *       404:
 *         description: User not found
 */
//Reset Password by admin Only
router.post("/admin/reset-password", verifyToken, authorizeRoles("admin"), resetUserPassword);
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Get a new access token using a refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Refresh token required
 *       403:
 *         description: Invalid or expired refresh token
 */
// refresh Token 
router.post("/refresh-token", refreshTokenHandler);

module.exports = router;
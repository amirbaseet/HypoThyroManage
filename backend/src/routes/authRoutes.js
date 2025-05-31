const express = require('express');
const {register,login, resetUserPassword, logout, updatePushToken, removePushToken, refreshTokenHandler } = require('../controllers/authController')
const router =express.Router();
const verifyToken = require("../middlewares/authMiddleware")
const authorizeRoles = require("../middlewares/roleMiddleware")

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);


// Update user's Expo push token
router.post("/update-push-token",verifyToken, updatePushToken);

// Remove push token (on logout)
router.post("/remove-push-token", verifyToken, removePushToken);

//Reset Password by admin Only
router.post("/admin/reset-password", verifyToken, authorizeRoles("admin"), resetUserPassword);

// refresh Token 
router.post("/refresh-token", refreshTokenHandler);

module.exports = router;
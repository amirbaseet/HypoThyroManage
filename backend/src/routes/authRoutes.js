const express = require('express');
const {register,login, updatePushToken, removePushToken } = require('../controllers/authController')
const router =express.Router();
const verifyToken = require("../middlewares/authMiddleware")
router.post("/register", register);
router.post("/login", login);


// Update user's Expo push token
router.post("/update-push-token",verifyToken, updatePushToken);

// Remove push token (on logout)
router.post("/remove-push-token",verifyToken, removePushToken);

module.exports = router;
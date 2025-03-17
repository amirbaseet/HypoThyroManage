const express = require('express');
const {register,login, updatePushToken } = require('../controllers/authController')
const router =express.Router();
const authorizeRoles = require("../middlewares/roleMiddleware")
const verifyToken = require("../middlewares/authMiddleware")
router.post("/register", register);
router.post("/login", login);


// Update user's Expo push token
router.post("/update-push-token",verifyToken, updatePushToken);

module.exports = router;
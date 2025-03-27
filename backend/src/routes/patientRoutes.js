const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// 🔹 Patient route to get active form window(s) with Google Form links
router.get('/form-windows/active', verifyToken, authorizeRoles("patient"), patientController.getActiveFormWindows);

module.exports = router;

const express = require('express');
const router = express.Router();
const exportToExcelController = require('../controllers/exportToExcelController');
const authorizeRoles = require("../middlewares/roleMiddleware")
const verifyToken = require("../middlewares/authMiddleware")

// Protect with admin middleware if needed
router.get("/export-all-medicine-logs", verifyToken, authorizeRoles("admin", "doctor"), exportToExcelController.exportAllMedicineLogs);
router.get("/export-weekly-reports", verifyToken, authorizeRoles("admin", "doctor") ,  exportToExcelController.exportAllWeeklyReports);
router.get("/export-specified-week-reports", verifyToken ,authorizeRoles("admin", "doctor"), exportToExcelController.exportAllSymptomAndCopingSubmissions);

module.exports = router;

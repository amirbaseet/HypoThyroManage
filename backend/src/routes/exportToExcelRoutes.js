const express = require('express');
const router = express.Router();
const exportToExcelController = require('../controllers/exportToExcelController');
const authorizeRoles = require("../middlewares/roleMiddleware")
const verifyToken = require("../middlewares/authMiddleware")
/**
 * @swagger
 * tags:
 *   name: Export
 *   description: Endpoints for exporting data to Excel
 */

/**
 * @swagger
 * /api/exportToExcel/export-all-medicine-logs:
 *   get:
 *     summary: Export all medicine logs for all patients (admin/doctor only)
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel file of all medicine logs
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Server error
 */
// Protect with admin middleware if needed
router.get("/export-all-medicine-logs", verifyToken, authorizeRoles("admin", "doctor"), exportToExcelController.exportAllMedicineLogs);
/**
 * @swagger
 * /api/exportToExcel/export-weekly-reports:
 *   get:
 *     summary: Export all weekly symptom reports for all patients (admin/doctor only)
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel file of all weekly reports
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Server error
 */

router.get("/export-weekly-reports", verifyToken, authorizeRoles("admin", "doctor") ,  exportToExcelController.exportAllWeeklyReports);

module.exports = router;

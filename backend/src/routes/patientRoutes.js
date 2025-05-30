const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: Endpoints for patients (e.g., symptom forms)
 */

/**
 * @swagger
 * /api/patient/form-windows/active:
 *   get:
 *     summary: Get active form windows (for patients)
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active form windows with form links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   symptomSeverityFormLink:
 *                     type: string
 *                   copingScaleFormLink:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *                   weekStart:
 *                     type: string
 *                     format: date
 *                   weekEnd:
 *                     type: string
 *                     format: date
 *       500:
 *         description: Server error
 */
// 🔹 Patient route to get active form window(s) with Google Form links
router.get('/form-windows/active', verifyToken, authorizeRoles("patient"), patientController.getActiveFormWindows);

module.exports = router;

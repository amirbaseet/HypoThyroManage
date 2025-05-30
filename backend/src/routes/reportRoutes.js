const express = require('express');
const verifyToken = require("../middlewares/authMiddleware")
const authorizeRoles = require("../middlewares/roleMiddleware")
const {
    submitReport,
    getReportsByUser,
    getLatestReportByUser,
    getReportsByDoctor,
    submitOrUpdateReport
} = require('../controllers/weeklyReportController');
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Weekly Reports
 *   description: Manage patient weekly symptom reports
 */

/**
 * @swagger
 * /api/reports/submit-report:
 *   patch:
 *     summary: Submit or update a weekly report (patient only)
 *     tags: [Weekly Reports]
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
 *               symptoms:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     symptomId:
 *                       type: string
 *                     hasSymptom:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Weekly report updated successfully
 *       201:
 *         description: Weekly report created successfully
 *       500:
 *         description: Server error
 */
//  Submit a weekly report
// router.post('/submit-report',verifyToken,authorizeRoles("patient"), submitReport);
router.patch('/submit-report',verifyToken,authorizeRoles("patient"), submitOrUpdateReport);
/**
 * @swagger
 * /api/reports/{userId}:
 *   get:
 *     summary: Get all reports for a specific user
 *     tags: [Weekly Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: List of reports
 *       404:
 *         description: No reports found for this user
 *       500:
 *         description: Server error
 */
//  Get all reports for a user
router.get('/:userId',verifyToken,authorizeRoles( "doctor", "patient" ), getReportsByUser);
/**
 * @swagger
 * /api/reports/latest-report/{userId}:
 *   get:
 *     summary: Get the latest weekly report for a user
 *     tags: [Weekly Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: Latest report for current week
 *       404:
 *         description: No report found for current week
 *       500:
 *         description: Server error
 */

//  Get the latest report for a user
router.get('/latest-report/:userId',verifyToken, authorizeRoles("doctor","patient"), getLatestReportByUser);
/**
 * @swagger
 * /api/reports/doctor/{doctorId}:
 *   get:
 *     summary: Get all reports for patients assigned to a specific doctor
 *     tags: [Weekly Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         schema:
 *           type: string
 *         required: true
 *         description: The doctor's user ID
 *     responses:
 *       200:
 *         description: List of reports and patients
 *       404:
 *         description: No patients found for this doctor
 *       500:
 *         description: Server error
 */
//  Get all reports for patients assigned to a specific doctor
router.get('/doctor/:doctorId',verifyToken, authorizeRoles("doctor"), getReportsByDoctor);


module.exports = router; 
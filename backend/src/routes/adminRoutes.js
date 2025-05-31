const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authorizeRoles = require("../middlewares/roleMiddleware")
const verifyToken = require("../middlewares/authMiddleware")
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints for managing Symptom Form Windows
 */

/**
 * @swagger
 * /api/admin/form-windows:
 *   post:
 *     summary: Create a new Symptom Form Window (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Week 1 Form
 *               symptomSeverityFormLink:
 *                 type: string
 *                 example: https://forms.example.com/severity
 *               copingScaleFormLink:
 *                 type: string
 *                 example: https://forms.example.com/coping
 *     responses:
 *       201:
 *         description: Form window created successfully
 *       400:
 *         description: Form window for this week already exists
 *       500:
 *         description: Server error
 */
// Protect with admin middleware if needed
router.post('/form-windows', verifyToken, authorizeRoles("admin"), adminController.createFormWindow);
/**
 * @swagger
 * /api/admin/form-windows:
 *   get:
 *     summary: Get all Symptom Form Windows (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all form windows
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
 *                   weekStart:
 *                     type: string
 *                     format: date
 *                   weekEnd:
 *                     type: string
 *                     format: date
 *                   symptomSeverityFormLink:
 *                     type: string
 *                   copingScaleFormLink:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *       500:
 *         description: Server error
 */
router.get('/form-windows', verifyToken, authorizeRoles("admin"), adminController.getAllFormWindows);
/**
 * @swagger
 * /api/admin/form-windows/{id}/toggle:
 *   patch:
 *     summary: Toggle the isActive status of a form window (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the form window
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Form window not found
 *       500:
 *         description: Server error
 */

router.patch('/form-windows/:id/toggle', verifyToken, authorizeRoles("admin"), adminController.toggleFormWindowStatus);


module.exports = router;

const express = require("express");
const router = express.Router();

const {
  takeMedicine,
  getProgress,
  getMissedMedicineUsers
} = require("../controllers/medicineController");

const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
/**
 * @swagger
 * tags:
 *   name: Medicine
 *   description: Endpoints for managing medicine intake and tracking
 */

/**
 * @swagger
 * /api/medicine/take:
 *   post:
 *     summary: Log today's medicine intake (patients only)
 *     tags: [Medicine]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taken:
 *                 type: boolean
 *                 description: "Whether the medicine was taken (default: true)"
 *     responses:
 *       200:
 *         description: Medicine log updated
 *       500:
 *         description: Server error
 */
// POST /api/medicine/take
router.post("/take", verifyToken, authorizeRoles("patient"), takeMedicine);
/**
 * @swagger
 * /api/medicine/progress:
 *   get:
 *     summary: Get a patient's medicine intake progress over time
 *     tags: [Medicine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: "Number of days to fetch (default: 60)"
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Patient userId (doctors can specify; patients default to own)
 *     responses:
 *       200:
 *         description: Weekly grouped medicine intake progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 weeks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       weekStart:
 *                         type: string
 *                         format: date
 *                       weekEnd:
 *                         type: string
 *                         format: date
 *                       logs:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             date:
 *                               type: string
 *                               format: date
 *                             taken:
 *                               type: boolean
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
// GET /api/medicine/progress?days=30
router.get("/progress", verifyToken, authorizeRoles("patient", "doctor"), getProgress);
/**
 * @swagger
 * /api/medicine/missed-medicine-users:
 *   get:
 *     summary: Get patients who missed today's medicine (doctors only)
 *     tags: [Medicine]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients who missed today's medicine
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 missedUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       phoneNumber:
 *                         type: string
 *       500:
 *         description: Server error
 */

router.get("/missed-medicine-users", verifyToken, authorizeRoles("doctor"), getMissedMedicineUsers);

module.exports = router;

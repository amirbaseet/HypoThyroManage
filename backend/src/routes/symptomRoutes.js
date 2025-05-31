const express = require("express");
const {getAllSymptoms, createSymptom} = require("../controllers/symptomController");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Symptoms
 *   description: Manage symptom definitions
 */

/**
 * @swagger
 * /api/symptoms:
 *   get:
 *     summary: Get all symptoms
 *     tags: [Symptoms]
 *     responses:
 *       200:
 *         description: List of all symptoms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/", getAllSymptoms);

/**
 * @swagger
 * /api/symptoms:
 *   post:
 *     summary: Create a new symptom
 *     tags: [Symptoms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Fatigue
 *     responses:
 *       201:
 *         description: Symptom created successfully
 *       400:
 *         description: Invalid data
 */
// Get all symptoms

// Create a new symptom
router.post("/", createSymptom);

module.exports = router;
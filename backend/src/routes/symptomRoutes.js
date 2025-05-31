const express = require("express");
const {getAllSymptoms, createSymptom} = require("../controllers/symptomController");
const router = express.Router();

// Get all symptoms
router.get("/", getAllSymptoms);

// Create a new symptom
router.post("/", createSymptom);

module.exports = router;
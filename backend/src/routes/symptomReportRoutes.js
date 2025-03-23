const express = require("express");
const { submitSymptomReport } = require("../controllers/symptomReportController");
const verifyToken = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/submit", verifyToken, submitSymptomReport);

module.exports = router;
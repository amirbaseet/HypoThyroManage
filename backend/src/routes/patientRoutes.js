const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const verifyToken = require("../middlewares/authMiddleware")


// 🔹 Patient routes
router.get('/form-windows/active', verifyToken, patientController.getActiveFormWindows);
router.get("/form-submissions/latest", verifyToken, patientController.getLatestSymptomSubmission);
router.patch("/form-submissions", verifyToken, patientController.submitSymptomForm);
router.get("/form-submissions/coping", verifyToken, patientController.getCopingSubmissions);
router.get('/coping', verifyToken, patientController.getLatestCopingSubmission);

// 🔹 Doctor route: view all submissions from their patients
router.get('/doctor/submissions', verifyToken, patientController.getSubmissionsByDoctor); // ✅ Add this

//Doctor And Patient
router.get('/form-submissions', verifyToken, patientController.getMySubmissions);

module.exports = router;

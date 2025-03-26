const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const verifyToken = require("../middlewares/authMiddleware")
const authorizeRoles = require("../middlewares/roleMiddleware")


// 🔹 Patient routes
//ölçeklmeler 
router.get('/form-windows/active', verifyToken, authorizeRoles("patient"), patientController.getActiveFormWindows);
router.get("/form-submissions/latest", verifyToken, authorizeRoles("patient"),patientController.getLatestSymptomSubmission);
router.patch("/form-submissions", verifyToken, authorizeRoles("patient"), patientController.submitSymptomForm);
router.get("/form-submissions/coping", verifyToken, authorizeRoles("patient"), patientController.getCopingSubmissions); 
router.get('/coping', verifyToken, authorizeRoles("patient"), patientController.getLatestCopingSubmission);
///
// 🔹 Doctor route: view all submissions from their patients
router.get('/doctor/submissions', verifyToken, authorizeRoles("doctor"), patientController.getSubmissionsByDoctor); // ✅ Add this

//Doctor And Patient
router.get('/form-submissions', verifyToken, patientController.getMySubmissions);

module.exports = router;

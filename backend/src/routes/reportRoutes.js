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

//  Submit a weekly report
// router.post('/submit-report',verifyToken,authorizeRoles("patient"), submitReport);
router.patch('/submit-report',verifyToken,authorizeRoles("patient"), submitOrUpdateReport);

//  Get all reports for a user
router.get('/:userId',verifyToken,authorizeRoles( "doctor", "patient" ), getReportsByUser);

//  Get the latest report for a user
router.get('/latest-report/:userId',verifyToken, authorizeRoles("doctor","patient"), getLatestReportByUser);

//  Get all reports for patients assigned to a specific doctor
router.get('/doctor/:doctorId',verifyToken, authorizeRoles("doctor"), getReportsByDoctor);


module.exports = router; 
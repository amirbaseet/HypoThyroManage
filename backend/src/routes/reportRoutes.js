const express = require('express');
const {
    submitReport,
    getReportsByUser,
    getLatestReportByUser,
    getReportsByDoctor
} = require('../controllers/weeklyReportController');
const router = express.Router();

//  Submit a weekly report
router.post('/submit-report', submitReport);

//  Get all reports for a user
router.get('/:userId', getReportsByUser);

//  Get the latest report for a user
router.get('/latest-report/:userId', getLatestReportByUser);

//  Get all reports for patients assigned to a specific doctor
router.get('/doctor/:doctorId', getReportsByDoctor);


module.exports = router; 
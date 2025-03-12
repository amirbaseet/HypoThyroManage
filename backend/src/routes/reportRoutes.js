const express = require('express');
const {getCurrentWeek} = require('../utils/weekUtils');
const WeeklyReport = require('../models/weeklyReport');

const router = express.Router();

router.post('/submit-report', async (req, res)=>{
    try{
        const { userId, symptoms } = req.body;
        const { weekStart, weekEnd } = getCurrentWeek();

        const report = new WeeklyReport({ userId, weekStart, weekEnd, symptoms});
        await report.save();
        res.status(201).json({ message: "Weekly report submitted successfully!" });
    }catch(error){
        res.status(400).json({ error: error.message})
    }
});

// ✅ GET all reports for a user
router.get('/:userId', async (req, res) => {
    try {
        const reports = await WeeklyReport.find({ userId: req.params.userId })
            .populate('symptoms.symptomId', 'name')
            .sort({ weekStart: -1 });

        if (!reports.length) {
            return res.status(404).json({ message: "No reports found for this user." });
        }

        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
// ✅ GET the latest weekly report for a user
router.get('/latest-report/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the most recent report by sorting in descending order
        const latestReport = await WeeklyReport.findOne({ userId })
            .sort({ weekStart: -1 })
            .populate('symptoms.symptomId', 'name');

        if (!latestReport) {
            return res.status(404).json({ message: "No weekly report found for this user." });
        }

        res.json(latestReport);
    } catch (error) {
        console.error("❌ Error fetching latest report:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router; 
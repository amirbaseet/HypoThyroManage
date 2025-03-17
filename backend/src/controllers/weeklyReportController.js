const WeeklyReport = require('../models/weeklyReport');
const User = require('../models/userModels');
const {getCurrentWeek} = require('../utils/weekUtils');

/**
 *  Submit a Weekly Report
 */
exports.submitReport = async (req, res) => {
    try{
        const { userId, symptoms } = req.body;
        const { weekStart, weekEnd } = getCurrentWeek();

        const report = new WeeklyReport({ userId, weekStart, weekEnd, symptoms});
        await report.save();
        res.status(201).json({ message: "Weekly report submitted successfully!" });
    }catch(error){
        res.status(400).json({ error: error.message})
    }
};

/**
 * ✅ Get all reports for a specific user
 */
exports.getReportsByUser = async (req, res) => {
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
};

/**
 * ✅ Get the latest weekly report for a user
 */
exports.getLatestReportByUser = async (req, res) => {
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
};

/**
 * ✅ Get all reports for patients assigned to a specific doctor
 */
exports.getReportsByDoctor = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        // Find all patients assigned to the doctor
        const patients = await User.find({ doctorId }).select('_id username email');

        if (!patients.length) {
            return res.status(404).json({ message: "No patients found for this doctor." });
        }

        // Get all reports for those patients
        const patientIds = patients.map(patient => patient._id);
        const reports = await WeeklyReport.find({ userId: { $in: patientIds } })
            .populate('userId', 'username') // Fetch patient name
            .populate('symptoms.symptomId', 'name') // Fetch symptom names
            .sort({ weekStart: -1 });

        res.json({ patients, reports });
    } catch (error) {
        console.error("❌ Error fetching reports for doctor:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
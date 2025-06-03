/**
 * Weekly Report Controller
 * 
 * Handles CRUD operations for weekly symptom reports.
 * Functions:
 * - submitReport: Create a new weekly report.
 * - getReportsByUser: Get all reports for a specific user.
 * - getLatestReportByUser: Get the latest report for a specific user.
 * - getReportsByDoctor: Get all reports for patients assigned to a doctor.
 * - submitOrUpdateReport: Create or update a report for the current week.
 */
const WeeklyReport = require('../models/weeklyReport');
const User = require('../models/userModels');
const {getCurrentWeek} = require('../utils/weekUtils');

/**
 * Submit a new weekly report.
 * 
 * @route POST /api/reports
 * @param {Object} req - Express request object (body: { userId, symptoms[] }).
 * @param {Object} res - Express response object.
 * 
 * @returns {Object} Success message.
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
 * Get all weekly reports for a specific user.
 * 
 * @route GET /api/reports/user/:userId
 * @param {Object} req - Express request object (params: userId).
 * @param {Object} res - Express response object.
 * 
 * @returns {Object[]} Array of reports.
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
 * Get the current week's report for a user.
 * 
 * @route GET /api/reports/user/:userId/latest
 * @param {Object} req - Express request object (params: userId).
 * @param {Object} res - Express response object.
 * 
 * @returns {Object} Weekly report.
 */
exports.getLatestReportByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const { weekStart, weekEnd } = getCurrentWeek();

        // Find the report for the current week
        const currentWeekReport = await WeeklyReport.findOne({
            userId,
            weekStart: { $eq: weekStart },
            weekEnd: { $eq: weekEnd },
        }).populate('symptoms.symptomId', 'name');

        if (!currentWeekReport) {
            return res.status(404).json({ message: "No report found for the current week." });
        }

        res.json(currentWeekReport);
    } catch (error) {
        console.error("❌ Error fetching current week report:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
/**
 * Get all reports for patients assigned to a specific doctor.
 * 
 * @route GET /api/reports/doctor/:doctorId
 * @param {Object} req - Express request object (params: doctorId).
 * @param {Object} res - Express response object.
 * 
 * @returns {Object} { patients: [], reports: [] }
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
/**
 * Submit or update a report for the current week.
 * 
 * @route POST /api/reports/submit-or-update
 * @param {Object} req - Express request object (body: { userId, symptoms[] }).
 * @param {Object} res - Express response object.
 * 
 * @returns {Object} Updated or created report.
 */
exports.submitOrUpdateReport = async ( req, res ) =>{
    try{
        const { userId , symptoms } = req.body; 
        const { weekStart, weekEnd } = getCurrentWeek();

        const filteredSymptoms = symptoms.filter(symptom => symptom.hasSymptom)
        //check if the user already has a report for the current week
        let report = await WeeklyReport.findOne({ userId, weekStart });
        
        if(report){
            //update existing report
            report.symptoms = filteredSymptoms;
            await report.save();
            return res.status(200).json({ message:"Weekly report updated successfully", report});
        }
        // If no report exists, create a new one
        report = new WeeklyReport({ userId, weekStart, weekEnd, symptoms: filteredSymptoms});
        await report.save();

        res.status(201).json({ message: "Weekly report created successfully!", report });
    }catch(error){
        console.error("❌ Error submitting/updating report:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
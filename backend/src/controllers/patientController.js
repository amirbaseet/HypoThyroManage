const SymptomFormWindow = require('../models/SymptomFormWindow');
const SymptomFormSubmission = require('../models/SymptomFormSubmission');
const User = require("../models/userModels");

// GET active form windows
exports.getActiveFormWindows = async (req, res) => {
    try {
        const activeWindows = await SymptomFormWindow.find({ isActive: true });
        res.status(200).json(activeWindows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getLatestSymptomSubmission = async (req, res) => {
    try {
        const { userId, formWindowId } = req.query;

        const submission = await SymptomFormSubmission.findOne({ userId, formWindowId })
            .populate("symptoms.symptomId", "name");

        if (!submission) {
            return res.status(404).json({ message: "No submission found" });
        }

        res.json(submission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.submitSymptomForm = async (req, res) => {
    try {
        const { formWindowId, symptoms } = req.body;
        const userId = req.user.id;

        // ✅ 1. Check if the form window exists and is active
        const formWindow = await SymptomFormWindow.findById(formWindowId);
        if (!formWindow) {
            return res.status(404).json({ error: "Form window not found." });
        }

        if (!formWindow.isActive) {
            return res.status(403).json({ error: "This form is no longer active." });
        }

        // ✅ 2. Check if user already submitted
        let existing = await SymptomFormSubmission.findOne({ userId, formWindowId });

        if (existing) {
            existing.symptoms = symptoms;
            await existing.save();
            return res.status(200).json({ message: "Form updated successfully." });
        }

        // ✅ 3. Submit new form
        const submission = await SymptomFormSubmission.create({
            userId,
            formWindowId,
            symptoms
        });

        res.status(201).json({ message: "Form created successfully.", submission });
    } catch (err) {
        console.error("❌ Error in submitSymptomForm:", err.message);
        res.status(500).json({ error: err.message });
    }
};
// GET all submissions for the logged-in patient
exports.getMySubmissions = async (req, res) => {
    try {
        const userId = req.user.id;
        const submissions = await SymptomFormSubmission.find({ userId })
            .populate('formWindowId')
            .populate('symptoms.symptomId'); // ✅ Ensures symptomId is full object

        res.status(200).json(submissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSubmissionsByDoctor = async (req, res) => {
    try {
        const doctorId = req.user.id; // Assuming doctor is authenticated

        // 🔍 Step 1: Get all patients assigned to this doctor
        const patients = await User.find({ doctorId }).select("_id username email");

        if (!patients.length) {
            return res.status(404).json({ message: "No patients found for this doctor." });
        }

        const patientIds = patients.map((p) => p._id);

        // 📄 Step 2: Get all symptom form submissions for those patients
        const submissions = await SymptomFormSubmission.find({
            userId: { $in: patientIds }
        })
            .populate("userId", "username email") // 👤 Patient info
            .populate("formWindowId", "title weekStart weekEnd") // 📆 Form info
            .populate("symptoms.symptomId", "name"); // 🩺 Symptom info

        res.json({ patients, submissions });
    } catch (error) {
        console.error("❌ Error fetching doctor submissions:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

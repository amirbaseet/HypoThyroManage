const SymptomFormWindow = require('../models/SymptomFormWindow');
const SymptomFormSubmission = require('../models/SymptomFormSubmission');
const SymptomCopingSubmission = require("../models/SymptomCopingSubmission");

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
        const { formWindowId, symptoms, copingResponses } = req.body;
        const userId = req.user.id;

        // ✅ Check form window validity
        const formWindow = await SymptomFormWindow.findById(formWindowId);
        if (!formWindow) {
            return res.status(404).json({ error: "Form window not found." });
        }
        if (!formWindow.isActive) {
            return res.status(403).json({ error: "This form is no longer active." });
        }

        // ✅ Symptom severity form submission
        let existing = await SymptomFormSubmission.findOne({ userId, formWindowId });
        if (existing) {
            existing.symptoms = symptoms;
            await existing.save();
        } else {
            await SymptomFormSubmission.create({ userId, formWindowId, symptoms });
        }

        // ✅ Hypothyroidism coping scale submission
        let existingCoping = await SymptomCopingSubmission.findOne({ userId, formWindowId });
        if (existingCoping) {
            existingCoping.entries = copingResponses;
            await existingCoping.save();
        } else {
            await SymptomCopingSubmission.create({
                userId,
                formWindowId,
                entries: copingResponses
            });
        }

        res.status(200).json({ message: "Form and coping responses submitted successfully." });

    } catch (err) {
        console.error("❌ Error in submitSymptomForm:", err.message);
        res.status(500).json({ error: err.message });
    }
};
// GET all submissions for the logged-in patient
exports.getMySubmissions = async (req, res) => {
    try {
        const userId = req.user.id;

        const symptomSubmissions = await SymptomFormSubmission.find({ userId })
            .populate('formWindowId')
            .populate('symptoms.symptomId');

        const copingSubmissions = await SymptomCopingSubmission.find({ userId })
            .populate('formWindowId');

        res.status(200).json({ symptomSubmissions, copingSubmissions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getCopingSubmissions = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await SymptomCopingSubmission.find({ userId }).populate("formWindowId");
        res.json(data);
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

const SymptomFormWindow = require('../models/SymptomFormWindow');
const { getCurrentWeek } = require('../utils/weekUtils');

// CREATE a new symptom form window
exports.createFormWindow = async (req, res) => {
    try {
        const { title } = req.body;

        const { weekStart, weekEnd } = getCurrentWeek(); // ✅ Auto week range

        const existing = await SymptomFormWindow.findOne({ weekStart });

        if (existing) {
            return res.status(400).json({ error: "Form window for this week already exists." });
        }

        const newWindow = await SymptomFormWindow.create({
            title,
            weekStart,
            weekEnd
        });

        res.status(201).json(newWindow);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET all form windows
exports.getAllFormWindows = async (req, res) => {
    try {
        const windows = await SymptomFormWindow.find().sort({ weekStart: -1 });
        res.status(200).json(windows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// TOGGLE isActive status
exports.toggleFormWindowStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const window = await SymptomFormWindow.findById(id);
        if (!window) return res.status(404).json({ error: 'Form window not found' });

        window.isActive = !window.isActive;
        await window.save();

        res.status(200).json({ message: 'Status updated', isActive: window.isActive });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

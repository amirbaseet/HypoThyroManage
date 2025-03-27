const SymptomFormWindow = require('../models/SymptomFormWindow');

// GET active form windows (for users to see links)
exports.getActiveFormWindows = async (req, res) => {
    try {
        const activeWindows = await SymptomFormWindow.find({ isActive: true });
        res.status(200).json(activeWindows); // includes links
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin could use this to see all windows (active or not)
exports.getAllFormWindows = async (req, res) => {
    try {
        const allWindows = await SymptomFormWindow.find({});
        res.status(200).json(allWindows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

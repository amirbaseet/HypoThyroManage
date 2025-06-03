/**
 * Symptom Form Window Controller
 * 
 * Provides endpoints for:
 * - Creating a weekly symptom form window
 * - Retrieving all form windows
 * - Toggling the activation status of a form window
 */
const SymptomFormWindow = require('../models/SymptomFormWindow');
const { getCurrentWeek } = require('../utils/weekUtils');

/**
 * @route POST /api/admin/form-window
 * @desc Create a new symptom form window for the current week
 * @access Admin
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @body {string} title - Title for the form window
 * @body {string} symptomSeverityFormLink - Link to symptom severity form
 * @body {string} copingScaleFormLink - Link to coping scale form
 */
exports.createFormWindow = async (req, res) => {
    try {
        const { title, symptomSeverityFormLink, copingScaleFormLink } = req.body;

        const { weekStart, weekEnd } = getCurrentWeek(); // Auto week range

        const existing = await SymptomFormWindow.findOne({ weekStart });
        if (existing) {
            return res.status(400).json({ error: "Form window for this week already exists." });
        }

        const newWindow = await SymptomFormWindow.create({
            title,
            weekStart,
            weekEnd,
            symptomSeverityFormLink,
            copingScaleFormLink
        });

        res.status(201).json(newWindow);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @route GET /api/admin/form-window
 * @desc Get all symptom form windows (sorted by latest)
 * @access Admin
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */

exports.getAllFormWindows = async (req, res) => {
    try {
        const windows = await SymptomFormWindow.find().sort({ weekStart: -1 });
        res.status(200).json(windows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @route PATCH /api/admin/form-window/:id/toggle
 * @desc Toggle the isActive status of a form window
 * @access Admin
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {string} req.params.id - ID of the form window
 */
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

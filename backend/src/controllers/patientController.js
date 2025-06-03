/**
 * Patient Controller
 * 
 * Handles operations related to Symptom Form Windows for patients.
 * Functions:
 * - getActiveFormWindows: Fetch active form windows for patients to fill.
 * - getAllFormWindows: Fetch all form windows (admin view).
 */
const SymptomFormWindow = require('../models/SymptomFormWindow');

/**
 * Get all active symptom form windows for patients.
 * 
 * This endpoint is typically used by patients to see currently available forms and links.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * 
 * @returns {Object[]} Array of active SymptomFormWindow documents.
 * 
 * @route GET /api/patient/form-windows/active
 * 
 * @example
 * Response:
 * [
 *   {
 *     "_id": "abc123",
 *     "title": "Weekly Symptom Report",
 *     "link": "https://example.com/form/abc123",
 *     "isActive": true
 *   },
 *   ...
 * ]
 */
exports.getActiveFormWindows = async (req, res) => {
    try {
        const activeWindows = await SymptomFormWindow.find({ isActive: true });
        res.status(200).json(activeWindows); // includes links
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get all symptom form windows (active and inactive) - Admin use.
 * 
 * This endpoint allows admins to view all form windows regardless of status.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * 
 * @returns {Object[]} Array of all SymptomFormWindow documents.
 * 
 * @route GET /api/patient/form-windows
 */
exports.getAllFormWindows = async (req, res) => {
    try {
        const allWindows = await SymptomFormWindow.find({});
        res.status(200).json(allWindows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

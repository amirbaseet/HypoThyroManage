/**
 * Symptom Controller
 * 
 * Handles CRUD operations for Symptom data.
 * Functions:
 * - getAllSymptoms: Retrieve all symptoms.
 * - createSymptom: Create a new symptom.
 */
const Symptom  = require("../models/Symptom");

/**
 * Get all symptoms.
 * 
 * @route GET /api/symptoms
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * 
 * @returns {Object[]} Array of symptom documents.
 * 
 * @example
 * Response:
 * [
 *   { "_id": "abc123", "name": "Halsizlik" },
 *   { "_id": "def456", "name": "Kabızlık" },
 *   ...
 * ]
 */
exports.getAllSymptoms = async (req, res) =>{
    try{
    const symptoms = await Symptom.find();
    res.json(symptoms);
    }catch(error){
        console.error(" Error fetching symptoms:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * Create a new symptom.
 * 
 * @route POST /api/symptoms
 * @param {Object} req - Express request object (body should include 'name' of symptom).
 * @param {Object} res - Express response object.
 * 
 * @returns {Object} The created symptom document.
 * 
 * @example
 * Request Body:
 * {
 *   "name": "Yorgunluk"
 * }
 * 
 * Response:
 * {
 *   "_id": "abc123",
 *   "name": "Yorgunluk"
 * }
 */
exports.createSymptom = async (req,res) =>{
    try{
            const newSymptom = new Symptom(req.body);
            await newSymptom.save();
            res.status(201).json(newSymptom);
    }catch(error){
        console.error(" Error creating symptom:", error.message);
        res.status(400).json({ message: "Invalid data", error: error.message });
    }
}
const Symptom  = require("../models/Symptom");

/**
 * Get All Symptoms
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
 * Create a new symptom
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
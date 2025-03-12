const express = require("express");
const router = express.Router();
const Symptom  = require("../models/Symptom");

// Get all symptoms
router.get("/", async (req, res) => {
    const symptoms = await Symptom.find();
    res.json(symptoms);
});

// Create a new symptom
router.post("/",async (req,res) =>{
    const newSymptom = new Symptom(req.body);
    await newSymptom.save();
    res.status(201).json(newSymptom);
})

module.exports = router;
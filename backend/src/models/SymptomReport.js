const mongoose = require("mongoose");


const symptomReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Array of exactly 20 symptoms with severity 0–5
    symptoms: [
        {
            symptomId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Symptom',
                required: true
            },
            severity: {
                type: Number,
                required: true,
                min: 0,
                max: 5
            }
        }
    ],

    submittedAt: {
        type: Date,
        default: Date.now
    }
});
// symptomReportSchema.index({ userId: 1, weekNumber: 1 }, { unique: true });
module.exports = mongoose.model("SymptomReport", symptomReportSchema)
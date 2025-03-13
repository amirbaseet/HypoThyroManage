const mongoose = require("mongoose");

const weeklyReportSchema = new mongoose.Schema({
    userId: {type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true},
    weekStart: { type: Date, required: true },//Monday
    weekEnd: { type: Date, required: true },//Monday
    symptoms:[
        {
            symptomId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Symptom', required:true },
            hasSymptom: {type: Boolean, required: true}
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

// Ensure each user can only have ONE report per week
// weeklyReportSchema.index({ userId: 1, weekStart: 1 }, { unique: true });




module.exports = mongoose.model('WeeklyReport', weeklyReportSchema);

const mongoose = require("mongoose");

const copingEntrySchema = new mongoose.Schema({
    symptomName: { type: String, required: true },
    copingLevel: { type: Number, min: 1, max: 5 },
    noComplaint: { type: Boolean, default: false }
});

const copingSubmissionSchema = new mongoose.Schema({
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    formWindowId: { type: mongoose.SchemaTypes.ObjectId, ref: 'SymptomFormWindow', required: true },
    entries: [copingEntrySchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SymptomCopingSubmission", copingSubmissionSchema);

const mongoose = require("mongoose");

const symptomFormSubmissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    formWindowId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'SymptomFormWindow',
        required: true
    },
    symptoms: [
        {
            symptomId: {
                type: mongoose.SchemaTypes.ObjectId,
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Unique submission per user per form window
// symptomFormSubmissionSchema.index({ userId: 1, formWindowId: 1 }, { unique: true });

module.exports = mongoose.model("SymptomFormSubmission", symptomFormSubmissionSchema);

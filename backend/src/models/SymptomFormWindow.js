const mongoose = require("mongoose");

const symptomFormWindowSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    weekStart: {
        type: Date,
        required: true
    },
    weekEnd: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    symptomSeverityFormLink: {
        type: String,
        required: true // or false, depending on use case
    },
    copingScaleFormLink: {
        type: String,
        required: true // or false, same as above
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("SymptomFormWindow", symptomFormWindowSchema);

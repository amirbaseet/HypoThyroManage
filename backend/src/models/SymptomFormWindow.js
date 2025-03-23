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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("SymptomFormWindow", symptomFormWindowSchema);

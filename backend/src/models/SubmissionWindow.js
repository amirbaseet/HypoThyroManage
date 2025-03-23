const mongoose = require("mongoose");

const submissionWindowSchema = new mongoose.Schema({
    // Represents the week number (e.g., 1, 6, 12, etc.)
    weekNumber: {
        type: Number,
        required: true,
        min: 1,
        unique: true
    },

    // Admin toggles this to control form access
    isOpen: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("SubmissionWindow", submissionWindowSchema);

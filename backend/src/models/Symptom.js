const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema({
    name: {type: String, required: true, unique:true},
});

module.exports = mongoose.model("Symptom", symptomSchema)
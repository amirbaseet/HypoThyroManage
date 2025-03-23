const mongoose = require("mongoose");

const medicineLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  day: {
    type: Number, // 1 - 31
    required: true,
  },
  month: {
    type: Number, // 0 - 11
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  taken: {
    type: Boolean,
    default: false,
  },
  weekStart: {
    type: Date,
    required: true,
  },
  weekEnd: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

medicineLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("MedicineLog", medicineLogSchema);

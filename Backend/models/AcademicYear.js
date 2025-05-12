const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema({
  year: { type: String, required: true }, 
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
}, { timestamps: true });

academicYearSchema.index({ year: 1, schoolId: 1 }, { unique: true });

module.exports = mongoose.model("AcademicYear", academicYearSchema);

const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema({
  year: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  isActive: { type: Boolean, default: false },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
}, { timestamps: true });

// Automatically set startDate and endDate based on the year
academicYearSchema.pre("save", function (next) {
  if (this.year) {
    const [startYear, endYear] = this.year.split("-");

    // Assuming academic year starts in July and ends in June
    const startDate = new Date(`${startYear}-07-01`);  // July 1st of the start year
    const endDate = new Date(`${endYear}-06-30`);     // June 30th of the end year

    this.startDate = startDate;
    this.endDate = endDate;
  }
  next();
});

academicYearSchema.index({ year: 1, orgId: 1 }, { unique: true });

module.exports = mongoose.model("AcademicYear", academicYearSchema);

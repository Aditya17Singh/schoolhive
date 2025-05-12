const mongoose = require("mongoose");
const { Schema } = mongoose;

const SchoolSchema = new Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  prefix: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  password: { type: String, required: true }, 
  logo: { type: String }, // renamed to match frontend

  address: {
    line1: { type: String, required: true },
    line2: { type: String },
    stateDistrict: { type: String, required: true },
    city: { type: String, required: true },
    pinCode: { type: String, required: true },
  },

  classes: [{ type: String }], // added from Step 2
  academicYear: {
    start: { type: String, required: true }, // e.g. "2025"
    end: { type: String, required: true },   // e.g. "2026"
  },

  currentAcademicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear"
  },

}, { timestamps: true });

module.exports = mongoose.model("School", SchoolSchema);

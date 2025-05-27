const mongoose = require('mongoose');

const studentApplicationSchema = new mongoose.Schema({
  fName: { type: String, required: true },
  mName: { type: String },
  lName: { type: String },
  dob: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  religion: { type: String, required: true },
  nationality: { type: String, required: true },
  category: { type: String, required: true },
  admissionClass: { type: String, required: true },
  contactNumber: { type: String, required: true, match: /^[0-9]{10}$/ },
  email: { type: String, required: true },
  permanentAddress: {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  residentialAddress: {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },

  sameAsPermanent: { type: Boolean, default: false },

  fatherName: { type: String, required: true },
  fatherPhone: { type: String },
  fatherEmail: { type: String },

  motherName: { type: String, required: true },
  motherPhone: { type: String },
  motherEmail: { type: String },

  guardianName: { type: String },
  guardianPhone: { type: String },

  session: { type: String, required: true },
  aadhaarNumber: { type: String, required: true },
  abcId: { type: String },

  avatar: { type: String },
  aadharCard: { type: String },
  previousSchoolTC: { type: String },
  medicalCertificate: { type: String },
  birthCertificate: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Student || mongoose.model("Student", studentApplicationSchema);

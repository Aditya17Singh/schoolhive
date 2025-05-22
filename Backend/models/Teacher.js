const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  nearbyLandmark: String,
  city: String,
  district: String,
  state: String,
  pinCode: String,
});

const teacherSchema = new mongoose.Schema({
  fName: { type: String, required: true },
  mName: { type: String },
  lName: { type: String, required: true },
  dob: { type: Date, required: true },
  joiningDate: { type: Date, required: true },
  nationality: { type: String, required: true },
  aadharNumber: { type: String, required: true, unique: true },
  panNumber: { type: String, required: true, unique: true },
  bloodGroup: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  religion: { type: String },
  category: { type: String },
  maritalStatus: { type: String },
  residentialAddress: addressSchema,
  permanentAddress: addressSchema,
  assignedClass: {
    type: String,
    default: null,
  },
  assignedSection: {
    type: String,
    default: null,
  },

}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);

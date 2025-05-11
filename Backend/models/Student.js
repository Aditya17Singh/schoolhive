const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({
  // Section 1: Basic Student Info
  name: { type: String, required: true },
  admissionNumber: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  phone: { type: String }, // mobile number
  profilePicture: { type: String }, // URL or path to uploaded image
  dateOfAdmission: { type: Date },
  fee: { type: Number },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },

  // Section 2: Other Information
  dob: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  orphan: { type: Boolean, default: false },
  identifiableMark: { type: String },
  religion: { type: String },
  siblings: { type: Number },
  bloodGroup: { type: String },
  disease: { type: String },
  address: { type: String },

  // Section 3: Father/Guardian Info
  fatherName: { type: String },
  fatherOccupation: { type: String },
  fatherMobile: { type: String },
  fatherEducation: { type: String },

  // Section 4: Mother Info
  motherName: { type: String },
  motherOccupation: { type: String },
  motherMobile: { type: String },
});

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

module.exports = Student;

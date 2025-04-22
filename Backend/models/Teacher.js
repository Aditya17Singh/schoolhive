const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  phone: { type: String },
  address: { type: String },
  birthDate: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  photoUrl: { type: String },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  bloodType: { type: String },
  password: { type: String, default: "123456" },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
});

module.exports = mongoose.model("Teacher", teacherSchema);

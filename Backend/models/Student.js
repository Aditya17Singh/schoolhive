const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admissionNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Auto-generated from schoolCode + admissionNumber
  phone: { type: String },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
});

module.exports = mongoose.model("Student", studentSchema);

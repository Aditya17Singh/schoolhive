const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admissionNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Auto-generated from schoolCode + admissionNumber
  phone: { type: String },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  schoolCode: { type: String, required: true }, // ✅ ADD THIS LINE
});

// Hash the password before saving
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

module.exports = Student;

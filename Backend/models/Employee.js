const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    enum: [
      "Principal",
      "Teacher",
      "Management Staff",
      "Accountant",
      "Store Manager",
      "Other"
    ]
  },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  phone: { type: String },
  address: { type: String },
  dateOfJoining: { type: Date, required: true },
  monthlySalary: { type: Number, required: true },

  // Other Information
  fatherOrHusbandName: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  experience: { type: String },
  religion: { type: String },
  birthDate: { type: Date },
  education: { type: String },
  photoUrl: { type: String },

  // For teachers only
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],

  password: { type: String, default: "123456" },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true }
});

module.exports = mongoose.model("Employee", employeeSchema);

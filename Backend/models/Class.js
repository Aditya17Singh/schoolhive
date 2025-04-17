const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: String, required: true }, // Added section field
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
});

module.exports = mongoose.model("Class", classSchema);

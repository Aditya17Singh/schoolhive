const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: String, required: true }, // Added section field
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
});

classSchema.index({ name: 1, section: 1, schoolId: 1 }, { unique: true });
module.exports = mongoose.model("Class", classSchema);

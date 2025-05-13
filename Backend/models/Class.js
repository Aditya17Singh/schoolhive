const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Nursery", "1", "7", "12"
  section: { type: String, required: true }, // e.g. "A", "B"
  type: {
    type: String,
    required: true,
    enum: ["pre-primary", "primary", "middle", "secondary"]
  },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true }, 
});

// Unique index to prevent duplicate classes in the same school
classSchema.index({ name: 1, section: 1, schoolId: 1 }, { unique: true });

module.exports = mongoose.model("Class", classSchema);

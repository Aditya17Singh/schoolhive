const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" }, // ✅ add this
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
}, { timestamps: true });


// Unique subject names per organization
subjectSchema.index({ name: 1, orgId: 1, class: 1 }, { unique: true });

module.exports = mongoose.model("Subject", subjectSchema);

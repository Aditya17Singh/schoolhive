const mongoose = require("mongoose");

const timetableEntrySchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  section: { type: String, required: true },
  day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], required: true },
  startTime: { type: String, required: true }, 
  endTime: { type: String, required: true },   
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
}, { timestamps: true });

module.exports = mongoose.model("TimetableEntry", timetableEntrySchema);

const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // Only for role: 'Teacher'
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  room: { type: String },
  day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true }
});

module.exports = mongoose.model("Lesson", lessonSchema);

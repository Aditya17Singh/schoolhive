const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  section: { type: String },
  day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  entries: [
    {
      period: Number, 
      subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    },
  ],
});

module.exports = mongoose.model("Timetable", timetableSchema);

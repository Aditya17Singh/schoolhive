const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  });
  
  module.exports = mongoose.model("Lesson", lessonSchema);
  
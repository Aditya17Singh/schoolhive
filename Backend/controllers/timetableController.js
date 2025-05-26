const TimetableEntry = require("../models/TimetableEntry");

exports.getTeacherTimetable = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const timetable = await TimetableEntry.find({ teacher: teacherId })
      .populate("subject", "name")
      .populate("class", "name");

    res.status(200).json({ success: true, data: timetable });
  } catch (error) {
    console.error("Error fetching timetable:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

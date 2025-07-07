const Timetable = require("../models/Timetable");
const Period = require("../models/Period");

exports.createOrUpdateTimetable = async (req, res) => {
  const { classId, section, day, entries } = req.body;

  try {
    let timetable = await Timetable.findOne({ classId, section, day });

    if (timetable) {
      timetable.entries = entries;
      await timetable.save();
    } else {
      timetable = new Timetable({ classId, section, day, entries });
      await timetable.save();
    }

    res.status(200).json(timetable);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getTimetableByClassAndSection = async (req, res) => {
  const { classId, section } = req.query;

  try {
    let timetable = await Timetable.find({ classId, section }).populate("entries.subjectId entries.teacherId");

    if (timetable.length === 0) {
      // Fetch all periods
      const periods = await Period.find({});
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      // Create blank timetable
      const newTimetables = [];

      for (const day of days) {
        const entries = periods.map((p) => ({
          period: p.number,
          subjectId: null,
          teacherId: null,
        }));

        const tt = new Timetable({ classId, section, day, entries });
        await tt.save();
        newTimetables.push(tt);
      }

      timetable = await Timetable.find({ classId, section }).populate("entries.subjectId entries.teacherId");
    }

    res.status(200).json(timetable);
  } catch (err) {
    console.error("Error fetching timetable:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const Teacher = require("../models/Teacher");
const Lesson = require("../models/Lesson");

exports.createTeacher = async (req, res) => {
  try {
    const { subjects, ...teacherData } = req.body;

    // Assuming subjects is an array of subject IDs (e.g., from the frontend)
    const newTeacher = new Teacher({
      ...teacherData,
      subjects: subjects || [], // Set empty array if no subjects provided
    });

    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTeacherSchedule = async (req, res) => {
  try {
    const lessons = await Lesson.find({ teacher: req.params.id })
      .populate("class subject")
      .lean();

    const events = lessons.map((l) => ({
      title: `${l.class.name} | ${l.subject.name}`,
      start: l.startTime,
      end: l.endTime,
    }));

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = {
      $or: [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { employeeId: new RegExp(search, "i") },
      ],
    };
    const teachers = await Teacher.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Teacher.countDocuments(query);
    res.json({ teachers, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { subjects, ...teacherData } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      {
        ...teacherData,
        subjects: subjects || [], // Ensure subjects are updated correctly
      },
      { new: true }
    );

    if (!updatedTeacher) return res.status(404).json({ error: "Teacher not found" });
    res.json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) return res.status(404).json({ error: "Teacher not found" });
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

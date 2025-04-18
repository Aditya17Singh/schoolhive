const Class = require("../models/Class");
const Subject = require("../models/Subject");
const Student = require("../models/Student");

// Get All Classes with Sections
exports.getAllClasses = async (req, res) => {
  try {
    const schoolId = req.user.schoolId; // from decoded JWT
    const classes = await Class.find({ schoolId }).populate("subjects students");
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get Class by ID with Section, Subjects, and Students
exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate("subjects students");
    if (!classData) return res.status(404).json({ error: "Class not found" });
    res.json(classData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a New Class with Section
exports.createClass = async (req, res) => {
  try {
    const { name, section } = req.body;
    const schoolId = req.user.schoolId;

    // Check if class with same name, section, and schoolId already exists
    const existingClass = await Class.findOne({ name, section, schoolId });
    if (existingClass) {
      return res.status(400).json({ error: "Class with this name and section already exists." });
    }

    const newClass = new Class({ name, section, schoolId });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Class (Name or Section)
exports.updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClass) return res.status(404).json({ error: "Class not found" });
    res.json(updatedClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add Subject to Class
exports.addSubjectToClass = async (req, res) => {
  try {
    const { classId, subjectId } = req.body;

    const classData = await Class.findById(classId);
    if (!classData) return res.status(404).json({ error: "Class not found" });

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    if (!classData.subjects.includes(subjectId)) {
      classData.subjects.push(subjectId);
      await classData.save();
    }

    res.json({ message: "Subject added to class", classData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Student to Class
exports.addStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.body;

    const classData = await Class.findById(classId);
    if (!classData) return res.status(404).json({ error: "Class not found" });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    if (!classData.students.includes(studentId)) {
      classData.students.push(studentId);
      await classData.save();
    }

    res.json({ message: "Student added to class", classData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Class
exports.deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) return res.status(404).json({ error: "Class not found" });
    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

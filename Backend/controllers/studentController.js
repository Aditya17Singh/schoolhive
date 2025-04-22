const Student = require("../models/Student");
const Class = require("../models/Class");
const School = require("../models/School");

// ✅ Get all students in a specific class
exports.getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.find({ class: req.params.classId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createStudentInClass = async (req, res) => {
  try {
    const { name, admissionNumber, email, phone } = req.body;
    const classId = req.params.classId;

    // Step 1: Find the class and school
    const classDoc = await Class.findById(classId).populate("schoolId");
    if (!classDoc) return res.status(404).json({ error: "Class not found" });

    const schoolCode = classDoc.schoolId.code; // ✅ assuming School has `code`

    // Step 2: Generate password from schoolCode + admissionNumber
    const password = `${schoolCode}${admissionNumber}`;

    // Step 3: Create the student (now with schoolCode field)
    const newStudent = new Student({
      name,
      admissionNumber,
      email,
      phone,
      password, // plain, will be hashed by the schema
      class: classId,
      schoolCode, // ✅ important for login!
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getAllStudents = async (req, res) => {
  try {
    const { schoolCode } = req.query;

    const query = schoolCode ? { schoolCode } : {};

    const students = await Student.find(query).populate("class");

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("class");
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) return res.status(404).json({ error: "Student not found" });
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete all students by schoolCode
exports.deleteAllStudentsBySchoolCode = async (req, res) => {
  try {
    const { schoolCode } = req.query;

    if (!schoolCode) {
      return res.status(400).json({ error: "schoolCode is required" });
    }

    const result = await Student.deleteMany({ schoolCode });

    res.json({ message: `${result.deletedCount} students deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


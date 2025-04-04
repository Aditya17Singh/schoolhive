const Student = require("../models/Student");

// ✅ Get all students in a specific class
exports.getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.find({ class: req.params.classId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { name, admissionNumber, email, password, phone } = req.body;

    const newStudent = new Student({
      name,
      admissionNumber,
      email,
      password,
      phone
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Create a student and assign to a specific class
exports.createStudentInClass = async (req, res) => {
  try {
    const { name, admissionNumber, email, password, phone } = req.body;
    const classId = req.params.classId;

    const newStudent = new Student({
      name,
      admissionNumber,
      email,
      password,
      phone,
      class: classId, // Assign student to class
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Other existing CRUD functions remain the same
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("class");
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

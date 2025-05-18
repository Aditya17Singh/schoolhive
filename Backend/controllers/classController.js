const Class = require("../models/Class");
const Subject = require("../models/Subject");
const Student = require("../models/Student");

// Get All Classes with Subjects and Students
exports.getAllClasses = async (req, res) => {
  try {
    const orgId = req.user.id;
    const classes = await Class.find({ orgId })
      .populate({ path: "subjects", select: "name code employee" })
      .populate({ path: "students", select: "firstName lastName rollNo" });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Class by ID
// exports.getClassById = async (req, res) => {
//   try {
//     const classData = await Class.findById(req.params.id)
//       .populate({ path: "subjects", select: "name code employee" })
//       .populate({ path: "students", select: "firstName lastName rollNo" });
//     if (!classData) return res.status(404).json({ error: "Class not found" });
//     res.json(classData);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Create Class
exports.createClass = async (req, res) => {
  try {
    const { name, sections, type, orgId } = req.body;

    if (!orgId) return res.status(400).json({ error: "School ID (orgId) is required" });

    const existingClass = await Class.findOne({ name, orgId });
    if (existingClass) {
      return res.status(400).json({ error: "Class with this name already exists." });
    }

    let order = 0;
    switch (type) {
      case "pre-primary":
        order = (["Nursery", "PG", "LKG", "UKG"].indexOf(name) + 1) * 0.25;
        break;
      case "primary":
      case "middle":
        order = parseInt(name) || 0;
        break;
      case "secondary":
        const match = name.match(/\d+/);
        order = match ? parseInt(match[0]) : 0;
        break;
    }

    const newClass = new Class({ name, sections, type, order, orgId });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Class (name, sections, etc.)
exports.updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClass) return res.status(404).json({ error: "Class not found" });
    res.json(updatedClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Only Sections
exports.updateClassSections = async (req, res) => {
  try {
    const { id } = req.params;
    const { sections } = req.body;

    if (!Array.isArray(sections)) {
      return res.status(400).json({ error: "Sections must be an array." });
    }

    const updatedClass = await Class.findByIdAndUpdate(id, { sections }, { new: true });
    if (!updatedClass) return res.status(404).json({ error: "Class not found" });

    res.json({ message: "Sections updated successfully", class: updatedClass });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addSubjectToClass = async (req, res) => {
  try {
    const { classId, subjectNames = [], orgId } = req.body;

    if (!orgId) {
      return res.status(400).json({ error: "orgId is required to create subjects" });
    }

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Create class-specific subjects
    const subjectPromises = subjectNames.map(async (name) => {
      let subject = await Subject.findOne({ name, orgId, class: classId });

      if (!subject) {
        subject = await Subject.create({ name, orgId, class: classId });
      }

      return subject._id;
    });

    const subjectIds = await Promise.all(subjectPromises);

    classData.subjects = subjectIds;
    await classData.save();

    const populatedClass = await Class.findById(classId).populate({
      path: "subjects",
      select: "name code employee",
    });

    res.json({ message: "Subjects updated for class", classData: populatedClass });
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

// Delete Class (and clean up student references)
exports.deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;

    await Student.updateMany({ class: classId }, { $unset: { class: "" } });

    const deletedClass = await Class.findByIdAndDelete(classId);
    if (!deletedClass) return res.status(404).json({ error: "Class not found" });

    res.json({ message: "Class deleted, student references cleared." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Updated classController.js to handle class creation without req.user

const Class = require("../models/Class");
const Subject = require("../models/Subject");
const Student = require("../models/Student");

// Get All Classes with Sections
exports.getAllClasses = async (req, res) => {
  try {
    const orgId = req.user.id; 
    const classes = await Class.find({ orgId }).populate("subjects students");
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

exports.createClass = async (req, res) => {
  try {
    const { name, sections, type, orgId } = req.body;

    if (!orgId) {
      return res.status(400).json({ error: "School ID is required" });
    }

    // Check if class with same name, section, and orgId already exists
    const existingClass = await Class.findOne({ name,  orgId });
    if (existingClass) {
      return res.status(400).json({ error: "Class with this name and section already exists." });
    }

    // Automatically set the order based on the type and name
    let order = 0;

    switch (type) {
      case "pre-primary":
        order = (["Nursery", "PG", "LKG", "UKG"].indexOf(name) + 1) * 0.25;
        break;
      case "primary":
      case "middle": {
        const parsed = parseInt(name, 10);
        order = isNaN(parsed) ? 0 : parsed;
        break;
      }
      case "secondary": {
        const match = name.match(/\d+/);
        order = match ? parseInt(match[0], 10) : 0;
        break;
      }
      default:
        order = 0;
    }

    // Create a new class with the calculated order
    const newClass = new Class({
      name,
      sections,
      type,
      order,
      orgId,
    });

    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateClassSections = async (req, res) => {
  try {
    const { id } = req.params;
    const { sections } = req.body;

    if (!Array.isArray(sections)) {
      return res.status(400).json({ error: "Sections must be an array." });
    }

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { sections },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json({ message: "Sections updated successfully", class: updatedClass });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const { classId, subjectNames = [] } = req.body;

    const classData = await Class.findById(classId);
    if (!classData) return res.status(404).json({ error: "Class not found" });

    const newSubjectIds = [];

    for (const name of subjectNames) {
      let subject = await Subject.findOne({ name });

      if (!subject) {
        subject = await Subject.create({ name });
      }

      newSubjectIds.push(subject._id);
    }

    // Replace classData.subjects with newSubjectIds (remove old subjects not in the new list)
    classData.subjects = newSubjectIds;

    await classData.save();

    await classData.populate("subjects");

    res.json({ message: "Subjects updated for class", classData });
  } catch (error) {
    console.error(error);
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
    const classId = req.params.id;

    await Student.updateMany(
      { class: classId },
      { $unset: { class: "" } }
    );

    // 2. Delete the class itself
    const deletedClass = await Class.findByIdAndDelete(classId);
    if (!deletedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json({ message: "Class deleted, students' references removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
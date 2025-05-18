const Teacher = require("../models/Teacher");

const createTeacherProfile = async (req, res) => {
  try {
    const newTeacher = await Teacher.create(req.body);
    res.status(201).json({ success: true, data: newTeacher });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { createTeacherProfile };

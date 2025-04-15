// controllers/schoolController.js
const School = require("../models/School");

exports.registerSchool = async (req, res) => {
  try {
    const { name, code, contactEmail, contactPhone, address } = req.body;

    // Check for duplicate school code
    const existing = await School.findOne({ code });
    if (existing) return res.status(400).json({ message: "School code already exists" });

    const school = await School.create({ name, code, contactEmail, contactPhone, address });

    res.status(201).json({
      message: "School created successfully",
      schoolId: school._id,
      school,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
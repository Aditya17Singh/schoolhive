// controllers/schoolController.js
const School = require("../models/School");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

exports.registerSchool = async (req, res) => {
  try {
    const { name, code, contactEmail, contactPhone, address, adminName, adminEmail, adminPassword } = req.body;

    // Check duplicate school code
    const existing = await School.findOne({ code });
    if (existing) return res.status(400).json({ message: "School code already exists" });

    const school = await School.create({ name, code, contactEmail, contactPhone, address });

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await Admin.create({
      schoolId: school._id,
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    res.status(201).json({ message: "School and admin created", school, admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

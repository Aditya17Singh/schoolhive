const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const Student = require("../models/Student");
const School = require("../models/School"); 

// secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

router.post("/login", async (req, res) => {
  const { role, password } = req.body;

  try {
    let user;
    let schoolName = "";
    let schoolCode = "";

    if (role === "admin") {
      const { name, mobile, schoolCode: inputSchoolCode } = req.body;

      const school = await School.findOne({ code: inputSchoolCode });
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }

      user = await Admin.findOne({ name, mobile, schoolId: school._id });
      if (!user) {
        return res.status(401).json({ message: "Admin not found" });
      }

      schoolName = school.name;
      schoolCode = school.code;
    } else if (role === "student") {
      const { schoolCode: inputSchoolCode, admissionNumber } = req.body;
      user = await Student.findOne({ schoolCode: inputSchoolCode, admissionNumber });

      if (user) {
        const school = await School.findOne({ code: inputSchoolCode });
        schoolName = school?.name || "";
        schoolCode = inputSchoolCode;
      }
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        schoolId: user.schoolId,
        role,
        name: user.name,
        schoolCode
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role,
        schoolId: user.schoolId,
        schoolName,
        schoolCode, // ✅ Now included
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

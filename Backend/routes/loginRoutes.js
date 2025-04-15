const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Employee = require("../models/Employee");

// secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

router.post("/login", async (req, res) => {
  const { role, password } = req.body;

  try {
    let user;

    if (role === "admin") {
        const { name, mobile } = req.body;
        user = await Admin.findOne({ name, mobile });
      } else if (role === "student") {
        const { schoolCode, admissionNumber } = req.body;
        user = await Student.findOne({ schoolCode, admissionNumber });
      } else if (role === "employee") {
        const { schoolCode, employeeId } = req.body;
        user = await Employee.findOne({ schoolCode, employeeId });
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
        role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Option 1: Send JWT in HTTP-only cookie (secure)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Option 2: Or send in JSON (if using localStorage)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

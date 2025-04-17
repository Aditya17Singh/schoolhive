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

    if (role === "admin") {
      const { name, mobile, schoolCode } = req.body;
    
      const school = await School.findOne({ code: schoolCode });
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      console.log(Admin , 'Admin');
      
    
      user = await Admin.findOne({ name, mobile, schoolId: school._id });
      if (!user) {
        return res.status(401).json({ message: "Admin not found" });
      }
    
      schoolName = school.name;
    }
     else if (role === "student") {
        const { schoolCode, admissionNumber } = req.body;
        user = await Student.findOne({ schoolCode, admissionNumber });

        if (user) {
          const school = await School.findOne({ code: schoolCode });
          schoolName = school?.name || "";
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
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Option 2: Or send in JSON (if using localStorage)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role,
        schoolName
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

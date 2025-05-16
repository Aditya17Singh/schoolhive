const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const School = require("../models/Organization"); // School model

// secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

router.post("/login", async (req, res) => {
  const { role, password } = req.body;

  try {
    let school;

    // Check if the role is 'organization'
    if (role === "organization") {
      const { organizationEmail, password } = req.body;

      if (!organizationEmail || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const org = await School.findOne({ orgEmail: organizationEmail }); 

      if (!org)
        return res.status(404).json({ message: "Organization not found" });

      const isMatch = await bcrypt.compare(password, org.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        {
          id: org._id,
          role: "organization",
          name: org.orgName,
          schoolCode: org.prefix,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        user: {
          id: org._id,
          name: org.orgName,
          role: "organization",
          schoolCode: org.prefix,
        },
      });
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

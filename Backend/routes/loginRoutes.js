const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const School = require("../models/School");  // School model

// secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

router.post("/login", async (req, res) => {
  const { role, password } = req.body;

  try {
    let school;
    
    // Check if the role is 'organization'
    if (role === "organization") {
      const { organizationEmail, password: orgPassword } = req.body;

      if (!organizationEmail || !orgPassword) {
        return res.status(400).json({ message: "Email and password are required for organization login" });
      }

      // Find the school by the contactEmail
      school = await School.findOne({ contactEmail: organizationEmail });

      if (!school) {
        return res.status(404).json({ message: "Organization not found" });
      }

      // Compare the entered password with the hashed password in the database
      const isMatch = await bcrypt.compare(orgPassword, school.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create a JWT token for the organization
      const token = jwt.sign(
        {
          id: school._id,
          role: "organization",
          name: school.name,
          schoolCode: school.prefix, // Use school prefix as school code
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        user: {
          id: school._id,
          name: school.name,
          role: "organization",
          schoolCode: school.prefix, // schoolCode
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

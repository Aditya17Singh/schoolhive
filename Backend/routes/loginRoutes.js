const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const School = require("../models/Organization");
const Admin = require("../models/Admin"); 

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

router.post("/login", async (req, res) => {
  const { role, password } = req.body;

  try {
    if (role === "organization") {
      const { organizationEmail } = req.body;

      if (!organizationEmail || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const org = await School.findOne({ orgEmail: organizationEmail });

      if (!org) return res.status(404).json({ message: "Organization not found" });

      const bcrypt = require("bcryptjs");
      const isMatch = await bcrypt.compare(password, org.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

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

    if (role === "admin") {
      const { email } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const admin = await Admin.findOne({ email });

      if (!admin) return res.status(404).json({ message: "Admin not found" });

      if (password !== admin.phone) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: admin._id,
          role: "admin",
          name: `${admin.firstName} ${admin.lastName}`,
          email: admin.email,
          orgId: admin.orgId,
          permissions: admin.permissions || [], 
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        user: {
          id: admin._id,
          name: `${admin.firstName} ${admin.lastName}`,
          role: "admin",
          email: admin.email,
          orgId: admin.orgId,
          permissions: admin.permissions || [],
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

const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

// Get all admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ error: "Admin not found" });
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create an admin for a specific school
exports.createAdmin = async (req, res) => {
    try {
      const { schoolId } = req.params;
      const { name, email, password, role, mobile } = req.body;
  
      if (!schoolId) {
        return res.status(400).json({ error: "School ID is required" });
      }
  
      // Check if an admin already exists with same mobile (optional)
      const existingAdmin = await Admin.findOne({ schoolId, mobile });
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin with this mobile already exists" });
      }
  
      // ✅ Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newAdmin = new Admin({
        schoolId,
        name,
        email,
        password: hashedPassword, // Store hashed password
        mobile,
        role: role || "admin",
      });
  
      await newAdmin.save();
      res.status(201).json(newAdmin);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Update admin
exports.updateAdmin = async (req, res) => {
    try {
        const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAdmin) return res.status(404).json({ error: "Admin not found" });
        res.json(updatedAdmin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an admin
exports.deleteAdmin = async (req, res) => {
    try {
        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) return res.status(404).json({ error: "Admin not found" });
        res.json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// controllers/adminController.js
const Admin = require('../models/Admin');

exports.createAdmin = async (req, res) => {
  try {
    const { orgId, firstName, middleName, lastName, email, phone, address } = req.body;

    if (!orgId || !firstName || !lastName || !email || !phone) {
      return res.status(400).json({ message: "Please provide all required fields including orgId" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const admin = new Admin({
      orgId,
      firstName,
      middleName,
      lastName,
      email,
      phone,
      address
    });

    await admin.save();

    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAdminPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: "Permissions must be an array" });
    }

    const admin = await Admin.findByIdAndUpdate(
      id,
      { permissions },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Permissions updated", admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAdmins = async (req, res) => {
  try {
   const orgId = req.user.id;
    if (!orgId) {
      return res.status(400).json({ message: "orgId is required" });
    }

    const admins = await Admin.find({ orgId })
      .populate("orgId", "name code")
      .sort({ createdAt: -1 });

    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

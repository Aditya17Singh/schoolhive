// controllers/adminController.js
const Admin = require('../models/Admin');

exports.createAdmin = async (req, res) => {
  try {
    const { orgId, firstName, middleName, lastName, email, phone, address } = req.body;

    if (!orgId || !firstName || !lastName || !email || !phone) {
      return res.status(400).json({ message: "Please provide all required fields including orgId" });
    }

    // Optional: Validate that orgId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(orgId)) {
      return res.status(400).json({ message: "Invalid orgId" });
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

exports.getAdmins = async (req, res) => {
  try {
    // You can also populate orgId to get organization details
    const admins = await Admin.find()
      .populate('orgId', 'name code') // Adjust fields per your Organization schema
      .sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

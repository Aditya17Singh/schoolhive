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
        const { schoolId } = req.params; // Extract schoolId from URL parameters
        const { name, email, password, role } = req.body;

        if (!schoolId) {
            return res.status(400).json({ error: "School ID is required" });
        }

        // Create the admin associated with the schoolId
        const newAdmin = new Admin({
            schoolId,
            name,
            email,
            password, // Make sure to hash the password before saving
            role: role || 'admin',
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

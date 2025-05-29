const AcademicYear = require("../models/AcademicYear");

// Create a new Academic Year
exports.createAcademicYear = async (req, res) => {
  try {
    const { year, orgId, isActive = false } = req.body;

    if (!orgId) {
      return res.status(400).json({ error: "Organization ID is required." });
    }

    const existingYear = await AcademicYear.findOne({ year, orgId });
    if (existingYear) {
      return res.status(400).json({ error: "Academic year already exists for this organization." });
    }

    const count = await AcademicYear.countDocuments({ orgId });
    const activeStatus = count === 0 ? true : isActive;

    const newAcademicYear = new AcademicYear({ year, orgId, isActive: activeStatus });
    await newAcademicYear.save();

    res.status(201).json({ message: "Academic Year created successfully", academicYear: newAcademicYear });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Academic Years for a School
exports.getAllAcademicYears = async (req, res) => {
  try {
    const orgId = req.user.id;
    const academicYears = await AcademicYear.find({ orgId }).sort({ year: -1 });
    res.json(academicYears);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the Active Academic Year
exports.getActiveAcademicYear = async (req, res) => {
  try {
    const orgId = req.user.id;
    const activeYear = await AcademicYear.findOne({ orgId, isActive: true });

    if (!activeYear) {
      return res.status(404).json({ message: "No active academic year found." });
    }

    res.json(activeYear);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Admission Settings (open/close & fee)
exports.updateAdmissionSettings = async (req, res) => {
  try {
    const { admissionOpen, admissionFee } = req.body;
    const orgId = req.user.id;

    const activeYear = await AcademicYear.findOne({ orgId, isActive: true });
    if (!activeYear) {
      return res.status(404).json({ message: "Active academic year not found." });
    }

    if (typeof admissionOpen !== "undefined") activeYear.admissionOpen = admissionOpen;
    if (typeof admissionFee !== "undefined") activeYear.admissionFee = admissionFee;

    await activeYear.save();

    res.json({
      message: "Admission settings updated successfully.",
      admissionOpen: activeYear.admissionOpen,
      admissionFee: activeYear.admissionFee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

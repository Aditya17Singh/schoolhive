const AcademicYear = require("../models/AcademicYear");

// Create a new Academic Year
exports.createAcademicYear = async (req, res) => {
  try {
    const { year, schoolId, isActive = false } = req.body;

    // Check if academic year for the given schoolId already exists
    const existingYear = await AcademicYear.findOne({ year, schoolId });
    if (existingYear) {
      return res.status(400).json({ error: "Academic year already exists for this school." });
    }

    // Create new academic year
    const newAcademicYear = new AcademicYear({
      year,
      schoolId,
      isActive,
    });

    await newAcademicYear.save();
    res.status(201).json({ message: "Academic Year created successfully", academicYear: newAcademicYear });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Academic Years for a School
exports.getAllAcademicYears = async (req, res) => {
  try {
    const schoolId = req.user.schoolId; // Extract schoolId from the authenticated user
    const academicYears = await AcademicYear.find({ schoolId }).sort({ year: -1 }); // Sort by year (descending)
    res.json(academicYears);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Academic Year by ID
exports.getAcademicYearById = async (req, res) => {
  try {
    const academicYear = await AcademicYear.findById(req.params.id);
    if (!academicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }
    res.json(academicYear);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Academic Year (e.g., to activate or deactivate)
exports.updateAcademicYear = async (req, res) => {
  try {
    const updatedAcademicYear = await AcademicYear.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAcademicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }
    res.json(updatedAcademicYear);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Academic Year
exports.deleteAcademicYear = async (req, res) => {
  try {
    const academicYearId = req.params.id;

    const deletedAcademicYear = await AcademicYear.findByIdAndDelete(academicYearId);
    if (!deletedAcademicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }

    res.json({ message: "Academic year deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

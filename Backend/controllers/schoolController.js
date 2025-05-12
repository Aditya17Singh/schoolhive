const School = require("../models/School");
const Class = require("../models/Class");
const AcademicYear = require("../models/AcademicYear");

exports.registerSchool = async (req, res) => {
  try {
    const {
      name,
      shortName,
      prefix,
      code,
      contactEmail,
      contactPhone,
      password,
      logoUrl,
      address,
      academicYear,
      classes = [],
    } = req.body;

    // Check for duplicate school code
    const existing = await School.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "School code already exists" });
    }

    // Create the school
    const school = await School.create({
      name,
      shortName,
      prefix,
      code,
      contactEmail,
      contactPhone,
      password, // ⚠️ In production, hash this
      logoUrl,
      address,
    });

    // Create Academic Year linked to this school
    const newAcademicYear = await AcademicYear.create({
      year: academicYear.year,
      startDate: academicYear.startDate,
      endDate: academicYear.endDate,
      isActive: true,
      schoolId: school._id,
    });

    // Optionally link academicYearId back to school (if needed)
    // await School.findByIdAndUpdate(school._id, { currentAcademicYear: newAcademicYear._id });

    // Create Classes linked to the school
    let createdClasses = [];
    if (Array.isArray(classes) && classes.length > 0) {
      const classDocs = classes.map(cls => ({
        name: cls.name,
        section: cls.section,
        schoolId: school._id,
      }));

      createdClasses = await Class.insertMany(classDocs);
    }

    res.status(201).json({
      message: "School, academic year, and classes created successfully",
      schoolId: school._id,
      school,
      academicYear: newAcademicYear,
      classes: createdClasses,
    });
  } catch (err) {
    console.error("Error in registerSchool:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

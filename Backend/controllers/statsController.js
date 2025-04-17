const Class = require("../models/Class");

exports.getStats = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId;

    if (!schoolId) {
      return res.json({
        totalStudents: 0,
        totalClasses: 0,
        totalTeachers: 0,
        feeCollection: 0,
      });
    }

    const totalClasses = await Class.countDocuments({ schoolId });

    res.json({
      totalStudents: 0,        // Temporary
      totalClasses,
      totalTeachers: 0,        // Temporary
      feeCollection: 0,        // Temporary
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

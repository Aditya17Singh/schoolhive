const Class = require("../models/Class");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

exports.getStats = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId;
    const schoolCode = req.user?.schoolCode;

    if (!schoolId || !schoolCode) {
      return res.json({
        totalStudents: 0,
        totalClasses: 0,
        totalTeachers: 0,
        feeCollection: 0,
      });
    }

    const [totalClasses, totalTeachers, totalStudents] = await Promise.all([
      Class.countDocuments({ schoolId }),
      Teacher.countDocuments({ schoolId }),
      Student.countDocuments({ schoolCode }),
    ]);

    res.json({
      totalStudents, 
      totalClasses,
      totalTeachers, 
      feeCollection: 0, 
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

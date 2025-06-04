const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Admin = require("../models/Admin");

exports.getStats = async (req, res) => {
  try {
    const orgId = req.user?.id;

    if (!orgId) {
      return res.json({
        totalStudents: 0,
        totalTeachers: 0,
        totalAdmins: 0,
        feeCollection: 0,
      });
    }

    const [totalStudents, totalTeachers, totalAdmins] = await Promise.all([
      Student.countDocuments({ orgId }),
      Teacher.countDocuments({ orgID: orgId }),
      Admin.countDocuments({ orgId }),
    ]);

    res.json({
      totalStudents,
      totalTeachers,
      totalAdmins,
      feeCollection: 0, 
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

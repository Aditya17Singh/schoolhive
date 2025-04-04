const Student = require("../models/Student");
const Class = require("../models/Class");
const Teacher = require("../models/Teacher");
const Payment = require("../models/Payment");

exports.getStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalClasses = await Class.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const feeCollection = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalStudents,
      totalClasses,
      totalTeachers,
      feeCollection: feeCollection[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const mongoose = require("mongoose");

exports.getStats = async (req, res) => {
  try {
    const orgId = req.user?.id;

    if (!orgId) {
      return res.json({
        totalStudents: 0,
        totalTeachers: 0,
        totalAdmins: 0,
        feeCollection: 0,
        todaysBirthdays: [],
        upcomingBirthdays: []
      });
    }

    const [totalStudents, totalTeachers, totalAdmins] = await Promise.all([
      Student.countDocuments({ orgId }),
      Teacher.countDocuments({ orgId }),
      Admin.countDocuments({ orgId }),
    ]);

    const today = new Date();
    const todayMonth = today.getMonth() + 1; 
    const todayDate = today.getDate();

    const todaysBirthdays = await Student.find({
      orgId,
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: "$dob" }, todayDate] },
          { $eq: [{ $month: "$dob" }, todayMonth] }
        ]
      }
    }, { fName: 1, lName: 1, dob: 1, section: 1, admissionClass: 1 });

    const upcomingBirthdays = await Student.aggregate([
      {
        $addFields: {
          dobThisYear: {
            $dateFromParts: {
              year: today.getFullYear(),
              month: { $month: "$dob" },
              day: { $dayOfMonth: "$dob" }
            }
          }
        }
      },
      {
        $match: {
          orgId: new mongoose.Types.ObjectId(orgId),
          dobThisYear: {
            $gt: today,
            $lte: new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
          }
        }
      },
      {
        $project: {
          fName: 1,
          lName: 1,
          dob: 1,
          section: 1,
          admissionClass: 1
        }
      },
      { $sort: { dobThisYear: 1 } }
    ]);

    res.json({
      totalStudents,
      totalTeachers,
      totalAdmins,
      feeCollection: 0, 
      todaysBirthdays,
      upcomingBirthdays
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

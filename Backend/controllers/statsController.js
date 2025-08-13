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
      Student.countDocuments({ orgId, status: "admitted" }),
      Teacher.countDocuments({ orgId }),
      Admin.countDocuments({ orgId }),
    ]);

    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();
    const nextWeek = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));

    const [studentToday, teacherToday, adminToday] = await Promise.all([
      Student.find({
        orgId,
        status: "admitted",
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: "$dob" }, todayDate] },
            { $eq: [{ $month: "$dob" }, todayMonth] }
          ]
        }
      }, { fName: 1, lName: 1, dob: 1, section: 1, admissionClass: 1 }),

      Teacher.find({
        orgId,
        status: "approved",
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: "$dob" }, todayDate] },
            { $eq: [{ $month: "$dob" }, todayMonth] }
          ]
        }
      }, { fName: 1, lName: 1, dob: 1, assignedClass: 1, assignedSection: 1 }),

      Admin.find({
        orgId,
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: "$dob" }, todayDate] },
            { $eq: [{ $month: "$dob" }, todayMonth] }
          ]
        }
      }, { firstName: 1, lastName: 1, dob: 1 })
    ]);

    const todaysBirthdays = [
      ...studentToday.map(s => ({ type: "student", ...s.toObject() })),
      ...teacherToday.map(t => ({ type: "teacher", ...t.toObject() })),
      ...adminToday.map(a => ({ type: "admin", ...a.toObject() })),
    ];

    const upcomingStudents = await Student.aggregate([
      {
        $match: {
          orgId: new mongoose.Types.ObjectId(orgId),
          status: "admitted"
        }
      },
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
          dobThisYear: { $gt: today, $lte: nextWeek }
        }
      },
      {
        $project: {
          fName: 1, lName: 1, dob: 1, section: 1, admissionClass: 1,
          type: { $literal: "student" }
        }
      },
      { $sort: { dobThisYear: 1 } }
    ]);

    const upcomingTeachers = await Teacher.aggregate([
      {
        $match: {
          orgId: new mongoose.Types.ObjectId(orgId),
          status: "approved"
        }
      },
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
          dobThisYear: { $gt: today, $lte: nextWeek }
        }
      },
      {
        $project: {
          fName: 1, lName: 1, dob: 1, assignedClass: 1, assignedSection: 1,
          type: { $literal: "teacher" }
        }
      },
      { $sort: { dobThisYear: 1 } }
    ]);

    const upcomingAdmins = await Admin.aggregate([
      {
        $match: {
          orgId: new mongoose.Types.ObjectId(orgId)
        }
      },
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
          dobThisYear: { $gt: today, $lte: nextWeek }
        }
      },
      {
        $project: {
          firstName: 1, lastName: 1, dob: 1,
          type: { $literal: "admin" }
        }
      },
      { $sort: { dobThisYear: 1 } }
    ]);

    const upcomingBirthdays = [
      ...upcomingStudents,
      ...upcomingTeachers,
      ...upcomingAdmins
    ].sort((a, b) => new Date(a.dob) - new Date(b.dob));

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


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

    const timeZone = "Asia/Kolkata";
    const today = new Date();
    const localToday = new Date(today.toLocaleString("en-US", { timeZone }));
    localToday.setHours(0, 0, 0, 0);

    const nextWeek = new Date(localToday);
    nextWeek.setDate(localToday.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);

    const todayDay = localToday.getDate();
    const todayMonth = localToday.getMonth() + 1;

    // ------------------- Today's Birthdays -------------------
    const [studentToday, teacherToday, adminToday] = await Promise.all([
      Student.find({
        orgId,
        status: "admitted",
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: { date: "$dob", timezone: timeZone } }, todayDay] },
            { $eq: [{ $month: { date: "$dob", timezone: timeZone } }, todayMonth] }
          ]
        }
      }, { fName: 1, lName: 1, dob: 1, section: 1, admissionClass: 1 }),

      Teacher.find({
        orgId,
        status: "approved",
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: { date: "$dob", timezone: timeZone } }, todayDay] },
            { $eq: [{ $month: { date: "$dob", timezone: timeZone } }, todayMonth] }
          ]
        }
      }, { fName: 1, lName: 1, dob: 1, assignedClass: 1, assignedSection: 1 }),

      Admin.find({
        orgId,
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: { date: "$dob", timezone: timeZone } }, todayDay] },
            { $eq: [{ $month: { date: "$dob", timezone: timeZone } }, todayMonth] }
          ]
        }
      }, { firstName: 1, lastName: 1, dob: 1 })
    ]);

    const todaysBirthdays = [
      ...studentToday.map(s => ({ type: "student", ...s.toObject() })),
      ...teacherToday.map(t => ({ type: "teacher", ...t.toObject() })),
      ...adminToday.map(a => ({ type: "admin", ...a.toObject() })),
    ];

    // ------------------- Upcoming Birthdays -------------------
    const excludeTodayMatch = {
      $not: {
        $and: [
          { $eq: [{ $dayOfMonth: { date: "$dob", timezone: timeZone } }, todayDay] },
          { $eq: [{ $month: { date: "$dob", timezone: timeZone } }, todayMonth] }
        ]
      }
    };

    const createUpcomingPipeline = (statusFilter, extraMatch = {}) => [
      {
        $match: {
          orgId: new mongoose.Types.ObjectId(orgId),
          ...extraMatch
        }
      },
      {
        $addFields: {
          dobThisYear: {
            $dateFromParts: {
              year: localToday.getFullYear(),
              month: { $month: "$dob" },
              day: { $dayOfMonth: "$dob" }
            }
          }
        }
      },
      {
        $match: {
          dobThisYear: { $gt: localToday, $lte: nextWeek },
          $expr: excludeTodayMatch
        }
      },
      { $sort: { dobThisYear: 1 } }
    ];

    const upcomingStudents = await Student.aggregate(createUpcomingPipeline(
      "admitted",
      { status: "admitted" }
    ));

    const upcomingTeachers = await Teacher.aggregate(createUpcomingPipeline(
      "approved",
      { status: "approved" }
    ));

    const upcomingAdmins = await Admin.aggregate(createUpcomingPipeline());

    const upcomingBirthdays = [
      ...upcomingStudents.map(s => ({ type: "student", ...s })),
      ...upcomingTeachers.map(t => ({ type: "teacher", ...t })),
      ...upcomingAdmins.map(a => ({ type: "admin", ...a }))
    ].sort((a, b) => new Date(a.dob) - new Date(b.dob));

    // ------------------- Response -------------------
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

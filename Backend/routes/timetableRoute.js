const express = require("express");
const router = express.Router();
const { getTeacherTimetable } = require("../controllers/timetableController");

router.get("/teacher/:teacherId", getTeacherTimetable);

module.exports = router;

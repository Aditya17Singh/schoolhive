// routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTeacherProfile,
  getAllTeachers,
  assignClassToTeacher,
  getSubjectsByTeacher,
} = require("../controllers/teacherController");
const verifyToken = require("../middleware/verifyToken");

router.get("/by-teacher/:teacherId", verifyToken, getSubjectsByTeacher);
router.post("/", verifyToken, createTeacherProfile);
router.get("/", verifyToken, getAllTeachers);
router.put("/assign/:teacherId", verifyToken, assignClassToTeacher);

module.exports = router;

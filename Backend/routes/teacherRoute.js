// routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTeacherProfile,
  getAllTeachers,
  assignClassToTeacher,
  getSubjectsByTeacher,
  updateTeacherStatus,
} = require("../controllers/teacherController");
const verifyToken = require("../middleware/verifyToken");

router.get("/by-teacher/:teacherId", verifyToken, getSubjectsByTeacher);
router.post("/", verifyToken, createTeacherProfile);
router.get("/", verifyToken, getAllTeachers);
router.put("/assign/:teacherId", verifyToken, assignClassToTeacher);
router.put("/status/:teacherId", verifyToken, updateTeacherStatus);

module.exports = router;

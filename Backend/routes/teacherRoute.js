// routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const { createTeacherProfile, getAllTeachers, assignClassToTeacher } = require("../controllers/teacherController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, createTeacherProfile);
router.get("/", verifyToken, getAllTeachers);
router.put("/assign/:teacherId", verifyToken, assignClassToTeacher);

module.exports = router;

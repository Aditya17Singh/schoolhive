const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const verifyToken = require("../middleware/verifyToken");

// Teacher Routes
router.get("/",verifyToken, teacherController.getAllTeachers);
router.get("/schedule/:id", verifyToken, teacherController.getTeacherSchedule);
router.get("/:id", teacherController.getTeacherById);
router.post("/",verifyToken, teacherController.createTeacher);
router.put("/:id", teacherController.updateTeacher);
router.delete("/:id", teacherController.deleteTeacher);

module.exports = router;

const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// ✅ Get all students
router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);
router.get("/class/:classId", studentController.getStudentsByClass);
router.post("/class/:classId", studentController.createStudentInClass);
router.post("/api/classes/:classId/students", studentController.createStudentInClass);
router.delete("/", studentController.deleteAllStudentsBySchoolCode);

module.exports = router;

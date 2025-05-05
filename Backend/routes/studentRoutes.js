const express = require("express");
const router = express.Router();
const multer = require("multer");
const studentController = require("../controllers/studentController");
const verifyToken = require("../middleware/verifyToken");
const storage = multer.memoryStorage(); // or use diskStorage for saving files to disk
const upload = multer({ storage });

// ✅ Get all students
router.get("/",verifyToken, studentController.getAllStudents);
router.get("/:id",verifyToken, studentController.getStudentById);
router.put("/:id",verifyToken, studentController.updateStudent);
router.delete("/:id",verifyToken, studentController.deleteStudent);
router.get("/class/:classId", studentController.getStudentsByClass);
router.post(
    "/class/:classId",
    verifyToken,
    upload.single("profilePicture"), // MUST match frontend field name
    studentController.createStudentInClass
  );
// router.post("/api/classes/:classId/students", studentController.createStudentInClass);
router.delete("/",verifyToken, studentController.deleteAllStudentsBySchoolCode);

module.exports = router;

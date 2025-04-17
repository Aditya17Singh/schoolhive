const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const studentController = require("../controllers/studentController");  // Import student controller
const verifyToken = require("../middleware/verifyToken");

// Class Routes
router.get("/",verifyToken, classController.getAllClasses);
router.get("/:id", classController.getClassById);
router.post("/", verifyToken, classController.createClass);
router.put("/:id", classController.updateClass);
router.put("/add-subject", classController.addSubjectToClass);
router.put("/add-student", classController.addStudentToClass);
router.delete("/:id", classController.deleteClass);
router.post("/:classId/students", studentController.createStudentInClass);
router.get("/:classId/students", studentController.getStudentsByClass);

module.exports = router;

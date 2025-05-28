// routes/classRoutes.js - Updated to handle the registration process

const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
// const studentController = require("../controllers/studentController");
const verifyToken = require("../middleware/verifyToken");

// Class Routes
router.get("/", verifyToken, classController.getAllClasses);
// router.get("/:id", classController.getClassById);

// Modified to work without token during registration
router.post("/", classController.createClass);

router.put("/:id/sections", verifyToken, classController.updateClassSections);
router.put("/add-subject", verifyToken, classController.addSubjectToClass);
router.delete("/:id", verifyToken, classController.deleteClass);
router.put("/:id", classController.updateClass);
router.put("/add-student", classController.addStudentToClass);
// router.post("/:classId/students", studentController.createStudentInClass);
// router.get("/:classId/students", studentController.getStudentsByClass);

module.exports = router;

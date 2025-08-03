const express = require("express");
const router = express.Router();
const multer = require("multer");
const studentController = require("../controllers/studentController");
const verifyToken = require("../middleware/verifyToken");

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

router.get("/", verifyToken, studentController.getAllStudentsForSchool);

router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
    { name: "previousSchoolTC", maxCount: 1 },
    { name: "medicalCertificate", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
  ]),
  studentController.createStudent
);

router.get("/gender-distribution", verifyToken, studentController.getGenderDistribution);
router.patch("/status/:id", verifyToken, studentController.updateStudentStatus);
router.get("/admissions", verifyToken, studentController.getAllStudent);
router.get("/stats", verifyToken, studentController.getStudentStats);
router.put("/promote", verifyToken, studentController.promoteStudents);
router.get("/search", verifyToken, studentController.getStudentsByClassAndSection);
router.get("/:orgUID", verifyToken, studentController.getStudentByOrgUID);
router.put("/:id", verifyToken, studentController.updateStudent);
router.delete("/:id", verifyToken, studentController.deleteStudent);

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const studentController = require("../controllers/studentController");
const verifyToken = require("../middleware/verifyToken");

const { upload } = require("../utils/multer-config");

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size should not exceed 2MB." });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

router.get("/", verifyToken, studentController.getAllStudentsForSchool);

router.post(
  "/",
  verifyToken,
  (req, res, next) => {
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "aadharCard", maxCount: 1 },
      { name: "previousSchoolTC", maxCount: 1 },
      { name: "medicalCertificate", maxCount: 1 },
      { name: "birthCertificate", maxCount: 1 },
    ])(req, res, function (err) {
      if (err) return multerErrorHandler(err, req, res, next);
      next();
    });
  },
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

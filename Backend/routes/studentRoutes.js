const express = require("express");
const router = express.Router();
const multer = require("multer");
const studentController = require("../controllers/studentController");
const verifyToken = require("../middleware/verifyToken");

const storage = multer.memoryStorage(); // or diskStorage
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

module.exports = router;

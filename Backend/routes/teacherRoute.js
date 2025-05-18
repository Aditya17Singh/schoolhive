// routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const { createTeacherProfile, getAllTeachers } = require("../controllers/teacherController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, createTeacherProfile);
router.get("/", verifyToken, getAllTeachers); 

module.exports = router;

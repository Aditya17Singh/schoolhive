const express = require("express");
const router = express.Router();
const { createTeacherProfile } = require("../controllers/teacherController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, createTeacherProfile);

module.exports = router;

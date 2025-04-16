// routes/schoolRoutes.js
const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/schoolController");

// Super Admin only - you can protect it with auth middleware later
router.post("/register", schoolController.registerSchool);

module.exports = router;

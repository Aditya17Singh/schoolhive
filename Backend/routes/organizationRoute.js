// routes/schoolRoutes.js
const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/organizationController");

// Super Admin only - you can protect it with auth middleware later
router.post("/register", schoolController.registerOrganization);

module.exports = router;

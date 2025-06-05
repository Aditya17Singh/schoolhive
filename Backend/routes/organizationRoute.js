// routes/schoolRoutes.js
const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/organizationController");
const verifyToken = require("../middleware/verifyToken");

// Super Admin only - you can protect it with auth middleware later
router.post("/register", schoolController.registerOrganization);
router.get("/:id", verifyToken, schoolController.getOrganizationById);

router.get("/admission/settings", verifyToken, schoolController.getAdmissionSettings);
router.put("/admission/settings", verifyToken, schoolController.updateAdmissionSettings);
router.get("/:id/stats", verifyToken, schoolController.getOrganizationStats);

module.exports = router;

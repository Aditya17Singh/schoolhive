const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Routes
router.get("/", adminController.getAllAdmins);
router.get("/:id", adminController.getAdminById);

// Create an admin for a specific school
router.post('/:schoolId/add-admin', adminController.createAdmin);

router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

module.exports = router;

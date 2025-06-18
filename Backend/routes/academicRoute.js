const express = require("express");
const router = express.Router();
const {
  createAcademicYear,
  getAllAcademicYears,
  getActiveAcademicYear,
  updateAdmissionSettings,
  getAdmissionSettings
} = require("../controllers/academicController");

const verifyToken = require("../middleware/verifyToken");

// Create a new academic year
router.post("/", verifyToken, createAcademicYear);

// Get all academic years for a school
router.get("/academic-years", verifyToken, getAllAcademicYears);

// Get the currently active academic year
router.get("/active", verifyToken, getActiveAcademicYear);

// Update admission settings (open/close toggle, fee)
router.put("/active/admission", verifyToken, updateAdmissionSettings);

router
  .route("/admission-settings")
  .get(verifyToken, getAdmissionSettings)
  .put(verifyToken, updateAdmissionSettings);
  
module.exports = router;

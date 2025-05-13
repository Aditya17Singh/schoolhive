const express = require("express");
const router = express.Router();
const { createAcademicYear, getAllAcademicYears, getAcademicYearById, updateAcademicYear, deleteAcademicYear } = require("../controllers/academicController");
const verifyToken = require("../middleware/verifyToken");

// Route to create a new academic year
router.post("/academic-years",verifyToken, createAcademicYear);

// Route to get all academic years for the authenticated school
router.get("/academic-years",verifyToken, getAllAcademicYears);

// Route to get a specific academic year by ID
router.get("/academic-years/:id",verifyToken, getAcademicYearById);

// Route to update an academic year (e.g., activate or deactivate)
router.put("/academic-years/:id",verifyToken, updateAcademicYear);

// Route to delete an academic year
router.delete("/academic-years/:id",verifyToken, deleteAcademicYear);

module.exports = router;

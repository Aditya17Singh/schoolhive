const express = require("express");
const router = express.Router();
const timetableController = require("../controllers/timetableController");

// POST - Create or update a day's timetable
router.post("/", timetableController.createOrUpdateTimetable);

// GET - Get timetable by class, section
router.get("/", timetableController.getTimetableByClassAndSection);

module.exports = router;

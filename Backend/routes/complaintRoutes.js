const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");

// Complaint Routes
router.get("/", complaintController.getAllComplaints);
router.post("/", complaintController.createComplaint);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/statsController");
const verifyToken = require("../middleware/verifyToken");

// GET /api/stats - Fetch dashboard statistics
router.get("/",verifyToken, getStats);

module.exports = router;

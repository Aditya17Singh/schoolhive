const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  deleteEvent,
  updateEvent
} = require("../controllers/scheduleController");
const verifyToken = require("../middleware/verifyToken");

router.post("/",verifyToken, createEvent); 
router.get("/:orgId",verifyToken, getEvents);
router.delete("/:id",verifyToken, deleteEvent); 
router.put("/:id", verifyToken, updateEvent);

module.exports = router;

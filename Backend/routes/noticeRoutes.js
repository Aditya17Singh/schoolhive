const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/noticeController");

// Notice Routes
router.get("/", noticeController.getAllNotices);
router.post("/", noticeController.createNotice);
router.delete("/:id", noticeController.deleteNotice); 
router.put("/:id", noticeController.updateNotice);

module.exports = router;

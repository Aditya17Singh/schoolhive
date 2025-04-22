const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/noticeController");
const verifyToken = require("../middleware/verifyToken"); // ⬅️ make sure this path is correct

// Notice Routes
router.get("/", verifyToken, noticeController.getAllNotices);
router.post("/", verifyToken, noticeController.createNotice);
router.delete("/:id",verifyToken,  noticeController.deleteNotice); 
router.put("/:id",verifyToken,  noticeController.updateNotice);

module.exports = router;

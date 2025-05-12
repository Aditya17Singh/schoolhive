const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, lessonController.getAllLessons);
router.post("/", verifyToken, lessonController.createLesson);
router.get("/:id", verifyToken, lessonController.getLessonById);
router.put("/:id", verifyToken, lessonController.updateLesson);
router.delete("/:id", verifyToken, lessonController.deleteLesson);

// Optional: Get schedule for one teacher
router.get("/teacher/:teacherId", verifyToken, lessonController.getLessonsByTeacher);

module.exports = router;

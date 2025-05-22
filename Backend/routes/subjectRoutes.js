const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");
const verifyToken = require("../middleware/verifyToken");

// Subject Routes
router.get("/", verifyToken, subjectController.getAllSubjects);
router.get("/:id", verifyToken, subjectController.getSubjectById);
router.post("/", verifyToken, subjectController.createSubject);
router.put("/:id", verifyToken, subjectController.updateSubject);
router.delete("/:id", verifyToken, subjectController.deleteSubject);
// routes/subject.js
router.put('/assign-teacher/:id',verifyToken, subjectController.assignOrRemoveTeacher);

module.exports = router;

const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const verifyToken = require("../middleware/verifyToken");

// General Employee Routes
router.get("/", verifyToken, employeeController.getAllEmployees);
router.get("/:id", employeeController.getEmployeeById);
router.post("/", verifyToken, employeeController.createEmployee);
router.put("/:id", employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

// Only for teachers
router.get("/schedule/:id", verifyToken, employeeController.getTeacherSchedule);

module.exports = router;

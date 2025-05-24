// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require("../middleware/verifyToken");

router.post('/',verifyToken,adminController.createAdmin);
router.get('/', verifyToken, adminController.getAdmins);
router.put("/:id/permissions",verifyToken, adminController.updateAdminPermissions);

module.exports = router;

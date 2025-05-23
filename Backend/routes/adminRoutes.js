// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require("../middleware/verifyToken");

// POST /admins - create admin
router.post('/',verifyToken,adminController.createAdmin);

// GET /admins - fetch all admins
router.get('/', verifyToken, adminController.getAdmins);

module.exports = router;

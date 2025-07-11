const express = require("express");
const router = express.Router();
const { sendOTPEmail, verifyOTPEmail } = require("../controllers/otpController");

router.post("/send-otp", sendOTPEmail);
router.post("/verify-otp", verifyOTPEmail);

module.exports = router;

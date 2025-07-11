const { sendOTP } = require("../utils/mailer");

const otpStore = {}; // { email: { otp, expiresAt } }

exports.sendOTPEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  otpStore[email] = { otp, expiresAt };

  try {
    await sendOTP(email, otp);
    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

exports.verifyOTPEmail = (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore[email];

  if (!stored) return res.status(400).json({ success: false, message: "OTP not sent or expired" });

  if (Date.now() > stored.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  delete otpStore[email];
  res.json({ success: true, message: "OTP verified" });
};

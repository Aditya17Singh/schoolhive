const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.sendOTP = async (to, otp) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

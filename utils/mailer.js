const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_PASS  
  }
});

const sendOTP = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: "Your OTP for Registration",
    text: `Your OTP is: ${otp}`,
    html: `<p>Your OTP is: <strong>${otp}</strong></p>`
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };

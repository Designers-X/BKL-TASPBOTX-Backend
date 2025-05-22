// const nodemailer = require("nodemailer");
// require("dotenv").config();
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER, 
//     pass: process.env.GMAIL_PASS  
//   }
// });

// const sendOTP = async (toEmail, otp) => {
//   const mailOptions = {
//     from: process.env.GMAIL_USER,
//     to: toEmail,
//     subject: "Your OTP for Registration",
//     text: `Your OTP is: ${otp}`,
//     html: `<p>Your OTP is: <strong>${otp}</strong></p>`
//   };

//   return transporter.sendMail(mailOptions);
// };

// module.exports = { sendOTP };
const axios = require("axios");

async function sendOTP(toEmail, otp) {
  const payload = {
    api_key: "api-D736AC2FF8CC4200A49A00355D03B399",  
    to: [toEmail],
    sender: "notification@designersx.us",
    subject: "Your Tasp Bot OTP Code is Here – Verify Now",
    html_body: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .header {
            margin-bottom: 30px;
          }
          .content {
            font-size: 16px;
            color: #555;
            margin-top: 20px;
          }
          .otp {
            display: inline-block;
            font-size: 28px;
            font-weight: bold;
            padding: 12px 25px;
            background-color: #4CAF50;
            color: white;
            border-radius: 8px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 30px;
          }
          .image-container {
            text-align: center;
            margin-top: 20px;
          }
          img {
            max-width: 120px;
          }
          h1 {
            font-weight: 500;
            font-size: 28px;
            color: #333;
            margin-bottom: 10px;
          }
          @media (max-width: 600px) {
            .container {
              padding: 15px;
            }
            .otp {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="image-container">
            <h1>Welcome to DialogXR</h1>
          </div>
          <div class="content">
            <p>We received a request to verify your email address. Please use the verification code below to complete the process:</p>
            <div class="otp">${otp}</div>
            <p>If you did not request this verification code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 DialogXR. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,
    text_body: `Your one-time verification code is: ${otp}. Do not share this code with anyone.`,
  };

  try {
    const response = await axios.post(
      "https://api.smtp2go.com/v3/email/send",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Email sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

module.exports = { sendOTP };

const express = require("express");
const router = express.Router();
const { signUpApi } = require("../controllers/ChatBot/SignUp");
const { loginApi } = require("../controllers/ChatBot/SignUp");
const {verifyOtpApi}=require("../controllers/ChatBot/SignUp");
const {resendOtpApi}=require("../controllers/ChatBot/SignUp");
const {loginAdminApi}=require("../controllers/Admin/Login");
router.post("/sign-up", signUpApi);
router.post("/login-api", loginApi);
router.post("/verify-otp",verifyOtpApi);
router.post("/admin-login",loginAdminApi);
router.post("/resend-otp",resendOtpApi)
module.exports = router;

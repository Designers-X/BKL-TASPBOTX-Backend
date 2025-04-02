const express = require("express");
const router = express.Router();
const { signUpApi } = require("../controllers/ChatBot/SignUp");
const { loginApi } = require("../controllers/ChatBot/SignUp");
const { verifyOtpApi } = require("../controllers/ChatBot/SignUp");
const { resendOtpApi } = require("../controllers/ChatBot/SignUp");
const { loginAdminApi } = require("../controllers/Admin/Login");
const {
  chatHistory,
  getChatHistory2,
  getChatHistory,
  deleteChatHistory,
} = require("../controllers/ChatBot/chatHistory");
const {
  requestOtpApi,
  verifyadminOtpApi,
  resetPasswordApi,
} = require("../controllers/Admin/ForgotPassword");
const { signupAdminApi } = require("../controllers/Admin/Signup");
const {
  getUserInfoApi,
  updateUserApi,
} = require("../controllers/Admin/UpdateAdmin");
const {
  getAllUsers,
  deleteUserApi,
} = require("../controllers/Admin/AllUsers/AllUsers");
router.post("/sign-up", signUpApi);
router.post("/login-api", loginApi);
router.post("/verify-otp", verifyOtpApi);
router.post("/admin-signup", signupAdminApi);
router.post("/admin-login", loginAdminApi);
router.post("/resend-otp", resendOtpApi);
router.post("/admin/request-otp", requestOtpApi);
router.post("/admin/verify-otp", verifyadminOtpApi);
router.post("/admin/reset-password", resetPasswordApi);
router.get("/user/:userId", getUserInfoApi);
router.post("/chat_history", chatHistory);
router.get("/get_chat_history", getChatHistory);
router.put("/user/update/:userId", updateUserApi);
router.get("/users", getAllUsers);
router.delete("/user/delete/:userId", deleteUserApi);
router.delete("/delete-chat-history", deleteChatHistory);
router.get("/get-chat-2", getChatHistory2);
module.exports = router;

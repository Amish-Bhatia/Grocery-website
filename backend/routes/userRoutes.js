const { login, verifyOtp, forgotpassword, resetpassword } = require('../controller/userController');
const express = require('express');
const router = express.Router();

router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot",forgotpassword)
router.post("/reset",resetpassword)

module.exports = router; 
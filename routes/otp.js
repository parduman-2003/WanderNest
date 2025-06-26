const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otp'); 
// Route to send OTP
router.post('/send-otp', otpController.sendOtp);

// Route to verify OTP
router.post('/verify-otp', otpController.verifyOtp);

// Optional: Forgot password routes
router.get('/forgot-password', otpController.forgotPassword);
router.post('/forgot-password/send-otp', otpController.forgotPasswordSendOtp);
router.post('/forgot-password/verify-otp', otpController.forgotPasswordVerifyOtp);
router.get('/change-password', otpController.changePasswordForm);
router.post('/change-password', otpController.changePasswordLogic);

module.exports = router;

const express = require("express");
const router = express.Router();
const { IsloggedIN } = require("../middleware");

const bookingController = require("../controllers/booking.js");


require("dotenv").config();

// create booking
router.post('/:id/book', IsloggedIN, bookingController.createBooking);

//show booking page
router.get('/dashboard', IsloggedIN, bookingController.bookingDashboard);

//delete booking
router.delete('/:id', IsloggedIN, bookingController.deleteBooking);

// Booking Confirmation Page
// Route to render confirmation page after clicking "Continue"
router.get('/:id/confirm', IsloggedIN, bookingController.bookingConfirmationPage);

// Send OTP for booking
router.post('/otp/send', bookingController.sendOtpForBooking);

// Verify OTP for booking
router.post('/otp/verify', bookingController.otpForVerifyBooking);

// POST: Final Booking after OTP
router.post('/:id/confirm-final', IsloggedIN, bookingController.finalBookingAfterOtp);


module.exports = router;


const Booking = require("../models/booking.js")

const Listing = require("../models/listing.js");
const nodemailer = require('nodemailer');
const cron = require("node-cron");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Run every day at 1:00 AM 
cron.schedule("0 1 * * *", async () => {
  const now = new Date();

  try {
    const result = await Booking.deleteMany({ checkout: { $lt: now } });
    console.log(`🧹 Cleaned ${result.deletedCount} expired bookings.`);
  } catch (err) {
    console.error("❌ Failed to clean expired bookings:", err);
  }
});

const createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkin, checkout, total } = req.body;

  const checkInDate = new Date(checkin);
  const checkOutDate = new Date(checkout);


  const existingUserBooking = await Booking.findOne({
    user: req.user._id,
    listing: id,
    $or: [
      {
        checkin: { $lt: checkOutDate },
        checkout: { $gt: checkInDate },
      },
    ],
  });

  if (existingUserBooking) {
    req.flash("error", `You've already booked this listing for overlapping dates.Try after ${checkOutDate}`);
    return res.redirect(`/listing/${id}`);
  }


  const overlappingBooking = await Booking.findOne({
    listing: id,
    $or: [
      {
        checkin: { $lt: checkOutDate },
        checkout: { $gt: checkInDate },
      },
    ],
  });

  if (overlappingBooking) {
    req.flash("error", `This listing is already booked for the selected dates.Try after ${checkOutDate}`);
    return res.redirect(`/listing/${id}`);
  }


  const booking = new Booking({
    user: req.user._id,
    listing: id,
    checkin: checkInDate,
    checkout: checkOutDate,
    total,
  });

  await booking.save();
  req.flash("success", "Booking confirmed!");
  res.redirect("/booking/dashboard");
};

const bookingDashboard = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('listing');
  res.render('./users/booking', { bookings });
}

const deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  req.flash('success', 'Booking cancelled');
  res.redirect('/booking/dashboard');
}

const bookingConfirmationPage = async (req, res) => {
  const { id } = req.params;
  const { checkin, checkout, total } = req.query;

  const listing = await Listing.findById(id);

  res.render('./users/confirm', {
    listing,
    checkin,
    checkout,
    total,
    user: req.user,
    messages: req.flash()
  });
}

const sendOtpForBooking = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  req.session.bookingOtp = otp;
  req.session.bookingOtpEmail = email;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Booking Confirmation OTP',
    text: `Your booking OTP is: ${otp}`
  });

  res.send('✅ OTP sent to your email.');
}

const otpForVerifyBooking = (req, res) => {
  const { otp, email } = req.body;

  if (
    req.session.bookingOtp === otp &&
    req.session.bookingOtpEmail === email
  ) {
    req.session.bookingOtp = null;
    return res.json({ success: true, message: 'OTP verified successfully!' });
  }

  return res.json({ success: false, message: 'Invalid OTP. Try again.' });
}

const finalBookingAfterOtp = async (req, res) => {
  const { id } = req.params;
  const { checkin, checkout, total, username, email, address } = req.body;

  const checkInDate = new Date(checkin);
  const checkOutDate = new Date(checkout);

  // checking same user has already booked this listing for overlapping dates
  const existingUserBooking = await Booking.findOne({
    user: req.user._id,
    listing: id,
    $or: [
      {
        checkin: { $lt: checkOutDate },
        checkout: { $gt: checkInDate },
      },
    ],
  });

  if (existingUserBooking) {
    req.flash("error", `You've already booked this listing for overlapping dates. Try again after ${checkOutDate.toDateString()}`);
    return res.redirect(`/listing/${id}`);
  }

  // checking if anyone else has booked overlapping dates
  const overlappingBooking = await Booking.findOne({
    listing: id,
    $or: [
      {
        checkin: { $lt: checkOutDate },
        checkout: { $gt: checkInDate },
      },
    ],
  });

  if (overlappingBooking) {
    req.flash("error", `This listing is already booked for the selected dates. Try again after ${checkOutDate.toDateString()}`);
    return res.redirect(`/listing/${id}`);
  }

  // Proceed to book
  const booking = new Booking({
    user: req.user._id,
    listing: id,
    checkin: checkInDate,
    checkout: checkOutDate,
    total,
    username,
    email,
    address,
  });

  await booking.save();
  req.flash('success', '🎉 Booking confirmed!');
  res.redirect('/booking/dashboard');
};


module.exports = {
  createBooking,
  bookingDashboard,
  deleteBooking,
  bookingConfirmationPage,
  sendOtpForBooking,
  otpForVerifyBooking,
  finalBookingAfterOtp
};

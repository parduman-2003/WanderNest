
const User = require('../models/user');

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();


  req.session.otp = otp;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your OTP for Signup",
    text: `Your OTP code is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent to:", email);
    res.send("OTP sent successfully.");
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    res.status(500).send("Failed to send OTP.");
  }
};

const verifyOtp = (req, res) => {
  const { userOtp } = req.body;
  if (req.session.otp && userOtp === req.session.otp) {
    req.session.otp = null;
    res.send("✅ OTP verified! You can now continue with signup.");
  } else {
    res.send("❌ Invalid OTP. Try again.");
  }
}

const forgotPassword = (req, res) => {
  res.render('./users/forgotPassword', { messages: req.flash() });
}

const forgotPasswordSendOtp = async (req, res) => {
  const { email, username } = req.body;
  const user = await User.findOne({ email, username });

  if (!user) return res.send("❌ User not found with this username and email");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  req.session.forgotOtp = otp;
  req.session.emailForOtp = email;
  req.session.usernameForOtp = username;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "OTP for password reset",
    text: `Your OTP is: ${otp}`
  });

  res.send("✅ OTP sent to your email.");
}

const forgotPasswordVerifyOtp = async (req, res) => {
  const { email, username, otp } = req.body;

  if (
    !req.session.forgotOtp ||
    !req.session.emailForOtp ||
    !req.session.usernameForOtp ||
    req.session.forgotOtp !== otp ||
    req.session.emailForOtp !== email ||
    req.session.usernameForOtp !== username
  ) {
    return res.json({ success: false, message: "Invalid or expired OTP" });
  }

  const user = await User.findOne({ email, username });

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }


  req.session.forgotOtp = null;
  req.session.emailForOtp = null;
  req.session.usernameForOtp = null;

  return res.json({
    success: true,
    message: "OTP verified successfully!",
    redirectUrl: `/change-password?email=${user.email}&username=${user.username}`
  });
}

const changePasswordForm = (req, res) => {
  res.render("./users/changePassword", {
    email: req.query.email, username: req.query.username,
    messages: req.flash()
  });
}

const changePasswordLogic = async (req, res) => {
  const { email, username, password, confirm } = req.body;

  if (password !== confirm) {
    req.flash('error', 'Passwords do not match');
    return res.redirect(`/change-password?email=${email}&username=${username}`);
  }

  try {
    const user = await User.findOne({ email, username });

    if (!user) {
      req.flash('error', 'User not found with that email and username');
      return res.redirect('/forgot-password');
    }

    await user.setPassword(password);
    await user.save();

    req.flash('success', 'Password updated successfully. Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error("Password change error:", err);
    req.flash('error', 'Something went wrong');
    res.redirect('/forgot-password');
  }
}

module.exports = {
  sendOtp,
  verifyOtp,
  forgotPassword,
  forgotPasswordSendOtp,
  forgotPasswordVerifyOtp,
  changePasswordForm,
  changePasswordLogic
}
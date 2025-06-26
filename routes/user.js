const express = require("express");
const router = express.Router();
const passport = require("passport");

const { saveRedirectUrl, IsloggedIN } = require('../middleware');
const multer = require("multer");
const { storage } = require("../cloudConfg.js");

const upload = multer({ storage });
const userController = require('../controllers/users.js');
console.log("userController:", userController);


require("dotenv").config();

router.route("/signUp")
  .get(userController.userSignUPForm)
  .post(userController.userSignUpLogic);

router.route("/login")
  .get(userController.userLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: '/login',
      failureFlash: true
    }),
    userController.userLoginLogic
  );

//become a host form
router.get("/become-a-host", userController.hostForm);

// host logic
router.post("/host", upload.single("user[profilePic]"), userController.hostPost);

// go to profile 
router.get("/profile", userController.userProfile);

// edit profile
router.get("/edit", userController.profileEdit);

// edit profile logic
router.put("/profile/edit", IsloggedIN, upload.single('profilepic'), userController.updateProfile);

// edit account form
router.get('/edit-account-info', IsloggedIN, userController.renderEditForm);

// edit accout logic
router.put('/edit', IsloggedIN, userController.updateUserDetails);

//logout Route
router.get("/logout", IsloggedIN, userController.userLogout);

//Host Profile preivew for user
router.get('/host/:id', userController.hostPreview);

module.exports = router;
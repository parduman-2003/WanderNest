console.log("usercontrolller loaded");
const Listing = require('../models/listing');
const Review = require('../models/reviews');
const User = require('../models/user');


const userSignUPForm = async (req, res) => {
  res.render('./users/signUp', { hideAuthButtons: true });
};

const userSignUpLogic = async (req, res) => {
  try {
    const { username, email, password } = req.body.user;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.logIn(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome ${registeredUser.username} to WanderNest`);
      res.redirect("/listing");
    });
  } catch (e) {
    req.flash("error", e.message);
    console.log(e);
    res.redirect("/signUp");
  }
};

const userLoginForm = async (req, res) => {
  res.render('./users/login', { hideAuthButtons: true });
};

const userLoginLogic = (req, res) => {
  req.flash("success", `Welcome back, ${req.user.username} to WanderNest!`);
  const redirectUrl = req.session.redirectUrl || "/listing";
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};


const hostForm = (req, res) => {
  res.render("./users/becomeHost.ejs", { user: req.user });
};


const hostPost = async (req, res, next) => {
  try {
    const {
      aboutMe,
      interests
    } = req.body;

    const userData = req.body.user || {};

    const updatedData = {
      isHost: true,
      aboutMe: aboutMe || "",
      interests: interests ? interests.split(',').map(i => i.trim()) : [],
      dreamDestination: userData.dreamDestination || "",
      work: userData.work || "",
      favSong: userData.favSong || "",
      pets: userData.pets || "",
      decadeBorn: userData.decadeBorn || "",
      school: userData.school || "",
      uselessSkill: userData.uselessSkill || "",
      tooMuchTime: userData.tooMuchTime || "",
      funFact: userData.funFact || "",
      bioTitle: userData.bioTitle || ""
    };

    if (req.file) {
      updatedData.profileImage = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await User.findByIdAndUpdate(req.user._id, updatedData, { new: true });
    req.flash("success", 'Your Profile is Successfully Created');
    res.redirect("/listing");
  } catch (err) {
    console.error("❌ Error becoming host:", err);
    next(err);
  }
};

const userProfile = async (req, res) => {
  try {
    const user = req.user;


    if (!user) {
      return res.redirect("/login");
    }


    const userListings = await Listing.find({ owner: user._id });
    const userId = req.user._id;
    const userReviews = await Review.find({ author: user._id })
      .populate({
        path: 'listing',
        populate: { path: 'owner' }
      });
    userReviews.reverse();
    userListings.reverse();
    res.render("./users/profile", {
      user,
      userListings, userReviews,
      returnTo: req.originalUrl
    });
  } catch (err) {
    console.error("Error rendering profile:", err);
    res.status(500).send("Something went wrong.");
  }
};


const profileEdit = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.render('./users/editprofile.ejs', { user });
  } catch (err) {
    console.error(err);
    res.redirect('./users/profile.ejs');
  }
}
const updateProfile = async (req, res) => {
  try {
    const {
      aboutMe,
      interests,
      dreamDestination,
      work,
      favSong,
      pets,
      decadeBorn,
      school,
      uselessSkill,
      tooMuchTime,
      funFact,
      bioTitle
    } = req.body;

    const user = await User.findById(req.user._id);


    user.aboutMe = aboutMe;
    user.interests = interests ? interests.split(',').map(i => i.trim()) : [];
    user.dreamDestination = dreamDestination;
    user.work = work;
    user.favSong = favSong;
    user.pets = pets;
    user.decadeBorn = decadeBorn;
    user.school = school;
    user.uselessSkill = uselessSkill;
    user.tooMuchTime = tooMuchTime;
    user.funFact = funFact;
    user.bioTitle = bioTitle;


    if (req.file) {
      user.profileImage = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await user.save();
    console.log("PUT /profile/edit hit");
    req.flash("success","Your Profile Is Successfully Updated");
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.redirect('/profile/edit');
  }
};


const userLogout = (req, res,) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to log out.");
    return res.redirect("/login");
  }

  const username = req.user.username;
  req.logout((err) => {
    if (err) {
      req.flash("error", "Error! Try Later");
      return res.redirect("/listing");
    }
    req.flash("success", `${username} is LOGGED OUT`);
    res.redirect("/listing");
  });
};

const renderEditForm = (req, res) => {
  res.render('./users/editaccountinfo.ejs', { user: req.user, messages: req.flash(), });
};
const updateUserDetails = async (req, res) => {
  try {
    const { username, email, newPassword, confirmPassword, currentPassword } = req.body;

    if (newPassword && newPassword !== confirmPassword) {
      req.flash('error', 'New password and confirm password do not match');
      return res.redirect('/edit-account-info');
    }

    if (!currentPassword || currentPassword.trim() === "") {
      req.flash('error', 'Current password is required');
      return res.redirect('/edit-account-info');
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/edit-account-info');
    }

    const auth = User.authenticate();
    auth(user.username, currentPassword, async (err, result) => {
      if (err || !result) {
        req.flash('error', 'Current password is incorrect');
        return res.redirect('/edit-account-info');
      }

      user.username = username;
      user.email = email;

      if (newPassword && newPassword.trim() !== "") {
        await user.setPassword(newPassword);
      }

      await user.save();

      req.flash('success', 'Account updated successfully');

     
      if (user.isHost) {
        return res.redirect('/profile');
      } else {
        return res.redirect('/listing'); 
      }
    });
  } catch (err) {
    console.error('❌ Error updating account:', err.message);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/edit-account-info');
  }
};

const hostPreview = async (req, res) => {
  try {
    const host = await User.findById(req.params.id);
    const listings = await Listing.find({ owner: host._id });
    const reviews = await Review.find({})
      .populate('author')
      .populate({
        path: 'listing',
        populate: { path: 'owner' }
      });

    const returnTo = req.query.returnTo || req.headers.referer || '/listing';

    const hostReviews = reviews.filter(review => review.listing?.owner?.equals(host._id));
    hostReviews.reverse();
    listings.reverse();
    res.render('users/hostProfile', { host, listings, reviews: hostReviews, returnTo, owner: listings.owner });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Host not found.');
    res.redirect('/listing');
  }
}
module.exports = {
  userSignUPForm,
  userSignUpLogic,
  userLoginForm,
  userLoginLogic,
  hostForm,
  hostPost,
  userProfile,
  profileEdit,
  updateProfile,
  renderEditForm,
  updateUserDetails,
  userLogout,
  hostPreview
};


const Listing = require("./models/listing");
const Review = require("./models/reviews");
const IsloggedIN = (req, res, next) => {
  if (!req.isAuthenticated()) {
    const url = req.originalUrl.includes("/book")
      ? req.originalUrl.split("/book")[0]
      : req.originalUrl;

    req.session.redirectUrl = url + "?bookNow=true";
    req.flash("error", "YOU MUST BE LOGGED IN !");
    return res.redirect("/login");
  }
  next();
};


const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const isListingOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listing");
  }

  if (!listing.owner || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listing/${id}`);
  }

  next();
};

const isReviewAuthor = async (req, res, next) => {
  const { reviewid } = req.params;
  const review = await Review.findById(reviewid);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not allowed to delete this review.");
    return res.redirect("back");
  }
  next();
};

module.exports = {
  isListingOwner,
  isReviewAuthor,
  IsloggedIN,
  saveRedirectUrl
}

const Wishlist = require("../models/wishlist");


const addToWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user._id;


    const exists = await Wishlist.findOne({ user: userId, listing: listingId });
    if (exists) {
      req.flash("error", "Already in your wishlist.");
      return res.redirect("back");
    }

    const newItem = new Wishlist({ user: userId, listing: listingId });
    await newItem.save();

    req.flash("success", "Added to wishlist!");
    res.redirect("back");
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("back");
  }
};

const showWishlist = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.user._id }).populate("listing");
    const wishlistListings = wishlistItems.map(item => item.listing);
    res.render("./users/wishlist.ejs", { wishlistListings });
  } catch (err) {
    console.error(err);
    req.flash("error", "Cannot load wishlist");
    res.redirect("/listing");
  }
};

const removeFromWishlist = async (req, res) => {
  const { listingId } = req.params;
  const userId = req.user._id;

  try {

    await Wishlist.findOneAndDelete({ user: userId, listing: listingId });

    req.flash('success', 'Removed from wishlist!');
    res.redirect('/wishlist');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not remove listing from wishlist.');
    res.redirect('/wishlist');
  }
};

module.exports = {
  addToWishlist,
  showWishlist,
  removeFromWishlist
}
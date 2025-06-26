const Listing = require("../models/listing");

const renderCategory = async (req, res, next) => {
  try {
    const categoryName = req.params.categoryName;

    const listings = await Listing.find({ category: { $in: [categoryName] } }).populate("reviews");
    listings.reverse();

    const allListings = listings.map((listing) => {
      const ratings = (listing.reviews || []).map((r) => r.rating);
      const total = ratings.reduce((sum, r) => sum + r, 0);
      const averageRating =
        ratings.length > 0 ? (total / ratings.length).toFixed(1) : "No ratings yet";

      return {
        ...listing._doc,
        averageRating,
      };
    });
    res.render("./listings/category", {
      listings: allListings,
      categoryName,
      query: '',
      returnTo: req.originalUrl
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { renderCategory };

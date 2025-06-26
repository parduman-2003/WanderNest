
const mongoose = require("mongoose");
const Listing = require("../models/listing");


const natural = require("natural");
const { isValidObjectId } = mongoose;

const indexRoute = async (req, res, next) => {
  try {
    let allListing = await Listing.find({}).populate("reviews");


    allListing = allListing.map(listing => {
      const ratings = (listing.reviews || []).map(r => r.rating);
      const total = ratings.reduce((sum, r) => sum + r, 0);
      const averageRating = ratings.length > 0
        ? (total / ratings.length).toFixed(1)
        : "No ratings yet";


      return {
        ...listing._doc,
        averageRating
      };
    });

    allListing.reverse();

    res.render("./listings/index", {
      allListing,
      query: "",
      returnTo: req.originalUrl
    });
  } catch (err) {
    next(err);
  }
};


const newRoute = (req, res) => {

  res.render("./listings/new");
}

function getAllNames(listings) {
  const names = new Set();
  for (let listing of listings) {
    if (listing.country) names.add(listing.country.toLowerCase());
    if (listing.location) names.add(listing.location.toLowerCase());
  }
  return Array.from(names);
}
const searchRoute = async (req, res) => {
  const rawQuery = req.query.q?.trim().toLowerCase() || "";
  const category = req.query.category || "";

  const allListings = await Listing.find({});
  const knownNames = getAllNames(allListings);

  let bestMatch = rawQuery;
  let bestScore = 0;

  for (let name of knownNames) {
    const score = natural.JaroWinklerDistance(rawQuery, name);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = name;
    }
  }

  const regex = new RegExp(bestMatch, "i");

  let matchedListings = allListings.filter(
    (l) => regex.test(l.location) || regex.test(l.country)
  );


  if (category) {
    matchedListings = matchedListings.filter((l) =>
      Array.isArray(l.category) && l.category.includes(category)
    );
  }

  if (category) {
    res.render("listings/category", {
      listings: matchedListings,
      categoryName: category,
      query: req.query.q || "",
      returnTo: req.originalUrl
    });
  } else {
    res.render("listings/index", {
      allListing: matchedListings,
      query: req.query.q || "",
      categoryName: "",
      returnTo: req.originalUrl
    });
  }
}
const showRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!isValidObjectId(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const listingData = await Listing.findById(id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: {
          path: "author",
          select: "username profileImage"
        }
      });

    if (!listingData) {
      return res.status(404).send("Listing not found");
    }

    listingData.views = (listingData.views || 0) + 1;

    if (!Array.isArray(listingData.category)) {
      listingData.category = listingData.category ? [listingData.category] : ["rooms"];
    }

    if (listingData.views > 5 && !listingData.category.includes("trending")) {
      listingData.category.push("trending");
    }

    await listingData.save();

    const ratings = listingData.reviews.map(review => review.rating);
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    const averageRating = ratings.length > 0 ? (total / ratings.length).toFixed(1) : "No ratings yet";

    const query = req.query.q || '';
    const category = req.query.category || '';
    const returnTo = req.query.returnTo || req.originalUrl;

    res.render("./listings/show", {
      listingData,
      currentUser: req.user,
      query,
      category,
      returnTo,
      averageRating,
      user,
      owner: listingData.owner,
    });

  } catch (err) {
    next(err);
  }
};


const createRoute = async (req, res, next) => {
  try {
    const listingData = req.body.listing;
    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;


    if (!req.file) {
      newListing.image = {
        url: "/public/images/photo-1552733407-5d5c46c3bb3b.avif",
        filename: "default"
      };
    } else {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }
    await newListing.save();
    console.log(req.body.listing);

    req.flash("success", `Your Listing Created with Title: ${newListing.title}`);
    res.redirect("/profile");

  } catch (err) {
    req.flash("error", 'Something Went Wrong! ,Try Again');
    next(err);
  }
};

const editRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const editlisting = await Listing.findById(id);

    if (!editlisting) {
      return res.status(404).send("Listing not found");
    }
    res.render("./listings/edit", { editlisting });
  } catch (err) {
    next(err);
  }
}
const updateRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body.listing;


    if (req.file) {
      updatedData.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!updatedListing) {
      return res.status(404).send("Listing not found");
    }

    req.flash("success", `Listing Updated: ${updatedListing.title}`);
    res.redirect(`/listing/${id}`);
  } catch (err) {
    req.flash("error", `error while updating the Listing: ${updatedListing.title}`);
    next(err);
  }
};

const deleteRoute = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }
    req.flash("success", `${deletedListing.title} Deleted`);
    res.redirect("/listing");
  } catch (err) {
    next(err);
  }
}

const aboutUs = (req, res) => {
  res.render("./listings/aboutus.ejs");
};
module.exports = {
  indexRoute,
  newRoute,
  createRoute,
  showRoute,
  searchRoute,
  editRoute,
  updateRoute,
  deleteRoute,
  aboutUs
};
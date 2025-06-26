
const mongoose = require("mongoose");
const Review = require("../models/reviews");
const listing = require('../models/listing');

const { isValidObjectId } = mongoose;

const postReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send("Invalid ID format");
        }

        const listingData = await listing.findById(id);
        if (!listingData) {
            return res.status(404).send("Listing not found");
        }

        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        newReview.listing = listingData._id;
        await newReview.save();

        listingData.reviews.push(newReview);
        await listingData.save();

        req.flash("success", "Review Added!");
        res.redirect(`/listing/${id}`);
    } catch (err) {
        console.log(err);
        next(err);
    }
};


const deleteReviewRoute = async (req, res, next) => {
    try {
        let { id, reviewid } = req.params;
        if (!isValidObjectId(reviewid)) {
            return res.status(400).send("Invalid ID format");
        }
        await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
        await Review.findByIdAndDelete(reviewid);
        req.flash("success", "Review Deleted!");
        res.redirect(`/listing/${id}`);

    } catch (err) {
        next(err);
    }
}

module.exports = {
    postReview,
    deleteReviewRoute
}
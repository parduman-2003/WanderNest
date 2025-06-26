const mongoose = require('mongoose');
const Review = require("../models/reviews.js");

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: {
        url: String,
        filename: String
    },
    price: { type: Number },
    location: { type: String },
    country: { type: String },
    views: {
        type: Number,
        default: 0
    },
    category: {
        type: [String],
        default: ['rooms'],
        enum: [
            "rooms",
            "farms",
            "pools",
            "castles",
            "camping",
            "mountains",
            "trending",
            "arctic",
            "iconic-cities"
        ],
        required: true
    },

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.model("Listing", listingSchema);

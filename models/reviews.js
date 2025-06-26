const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reply: {
        text: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
});

module.exports = mongoose.model("Review", reviewSchema);

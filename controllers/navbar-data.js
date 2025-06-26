
const Listing = require('../models/listing');
const Booking = require('../models/booking');
const Review = require('../models/reviews');
const notifications = async (req, res) => {
    try {
        const listings = await Listing.find({ owner: req.user._id });

        const listingIds = listings.map(l => l._id);

        const bookings = await Booking.find({ listing: { $in: listingIds } })
            .populate('user listing');

        const reviews = await Review.find({ listing: { $in: listingIds } })
            .populate('author listing');
        bookings.reverse();
        reviews.reverse();
        const returnTo = req.query.returnTo || req.headers.referer || '/listing';
        res.render('./users/notifications', { bookings, reviews, returnTo });
    } catch (e) {
        console.log(e);
        req.flash('error', 'Failed to load notifications');
        res.redirect('/listing');
    }
}
module.exports = { notifications }
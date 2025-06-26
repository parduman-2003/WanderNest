
const express = require("express");
const router = express.Router();
const { IsloggedIN } = require("../middleware");
const wishlistController = require("../controllers/wishlist");

// POST route to add listing to wishlist
router.post("/:listingId/add", IsloggedIN, wishlistController.addToWishlist);

//GET route to showWishlist
router.get("/", IsloggedIN, wishlistController.showWishlist);

// DELETE /wishlist/:listingId/remove
router.delete('/:listingId/remove', IsloggedIN, wishlistController.removeFromWishlist);

module.exports = router;

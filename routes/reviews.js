
const express = require("express");
const router = express.Router({ mergeParams: true });
const { IsloggedIN, isReviewAuthor } = require("../middleware");
const { postReview, deleteReviewRoute } = require("../controllers/reviews");


//  Route: Post Review
router.post("/", IsloggedIN, postReview);

//  Route: Delete Review 
router.delete("/:reviewid", IsloggedIN, isReviewAuthor, deleteReviewRoute);

module.exports = router;

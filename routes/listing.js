const express = require("express");
const router = express.Router();
const { IsloggedIN, isListingOwner } = require("../middleware");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfg.js");
const upload = multer({ storage });

// about route
router.get("/aboutus", listingController.aboutUs);
// Index Route
router.get("/", listingController.indexRoute);

// New Route
router.get("/new", IsloggedIN, listingController.newRoute);

// Create Route
router.post("/create", IsloggedIN, upload.single("listing[image]"), listingController.createRoute);

//search route
router.get("/search", listingController.searchRoute);

// Only match valid MongoDB ObjectId
router.get('/:id([a-fA-F0-9]{24})', listingController.showRoute);

// Edit Route
router.get("/:id/edit", IsloggedIN, isListingOwner, listingController.editRoute);

// Show, Update, Delete Routes
router.route("/:id")
  .get(listingController.showRoute)
  .put(IsloggedIN, isListingOwner, upload.single("listing[image]"), listingController.updateRoute)
  .delete(IsloggedIN, isListingOwner, listingController.deleteRoute);

module.exports = router;
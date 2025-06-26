const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categrories");

router.get('/categories/:categoryName', categoryController.renderCategory);


module.exports = router;
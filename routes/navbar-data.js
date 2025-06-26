const express = require('express');
const router = express.Router();
const { IsloggedIN } = require('../middleware');

const notificationController = require("../controllers/navbar-data");

router.get('/navbar-data', IsloggedIN, notificationController.notifications);

module.exports = router;

// Review Routes
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities")


// Show reviews for a vehicle
router.get("/:inv_id",
    utilities.checkJWTToken,
    utilities.checkLogin,
    reviewController.showReviews);

// Submit a new review
router.post("/add",
    utilities.checkJWTToken,
    utilities.checkLogin,
    reviewController.submitReview);

module.exports = router;

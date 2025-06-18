// Review Controller
const reviewModel = require("../models/review-model");
const utilities = require("../utilities/");

// Display reviews for a vehicle
async function showReviews(req, res) {
  const inv_id = req.params.inv_id;
  try {
    const reviews = await reviewModel.getReviewsByInvId(inv_id);
    const nav = await utilities.getNav();
    res.render("inventory/reviews", {
      title: "Vehicle Reviews",
      nav,
      reviews,
      inv_id,
      errors: null
    });
  } catch (error) {
    const nav = await utilities.getNav();
    res.render("inventory/reviews", {
      title: "Vehicle Reviews",
      nav,
      reviews: [],
      inv_id,
      errors: ["Error loading reviews"]
    });
  }
}

// Handle new review submission
async function submitReview(req, res) {
  const { inv_id } = req.body;
  // Use JWT-based authentication info
  const accountData = res.locals.accountData;
  const account_id = accountData ? accountData.account_id : undefined;
  const { review_text } = req.body;
  const errors = [];
  if (!review_text || review_text.trim().length < 3) {
    errors.push("Review must be at least 3 characters.");
  }
  if (!account_id) {
    errors.push("You must be logged in to submit a review.");
  }
  if (errors.length > 0) {
    const reviews = await reviewModel.getReviewsByInvId(inv_id);
    const nav = await utilities.getNav();
    return res.render("inventory/reviews", {
      title: "Vehicle Reviews",
      nav,
      reviews,
      inv_id,
      errors
    });
  }
  try {
    await reviewModel.addReview(inv_id, account_id, review_text.trim());
    res.redirect(`/reviews/${inv_id}`);
  } catch (error) {
    const reviews = await reviewModel.getReviewsByInvId(inv_id);
    const nav = await utilities.getNav();
    res.render("inventory/reviews", {
      title: "Vehicle Reviews",
      nav,
      reviews,
      inv_id,
      errors: ["Error saving review"]
    });
  }
}

module.exports = { showReviews, submitReview };

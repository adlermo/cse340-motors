// Review Model
// Handles database operations for reviews
const pool = require("../database/index");

// Get all reviews for a vehicle
async function getReviewsByInvId(inv_id) {
  try {
    const result = await pool.query(
      `SELECT r.review_id, r.review_text, r.review_date, a.account_firstname, a.account_lastname
       FROM reviews r
       JOIN account a ON r.account_id = a.account_id
       WHERE r.inv_id = $1
       ORDER BY r.review_date DESC`,
      [inv_id]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

// Add a new review
async function addReview(inv_id, account_id, review_text) {
  console.log('addReview called with:', { inv_id, account_id, review_text }); // Debug log
  try {
    const result = await pool.query(
      `INSERT INTO reviews (inv_id, account_id, review_text)
       VALUES ($1, $2, $3) RETURNING *`,
      [inv_id, account_id, review_text]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in addReview:', error); // Log the error
    throw error;
  }
}

module.exports = { getReviewsByInvId, addReview };

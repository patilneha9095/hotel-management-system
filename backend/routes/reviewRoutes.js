const express = require("express");

const {
  createReview,
  getMyReviews,
  getApprovedReviews,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Customer routes
router.post("/", protect, createReview);

router.get("/my", protect, getMyReviews);

// Public approved reviews
router.get("/approved", getApprovedReviews);

module.exports = router;
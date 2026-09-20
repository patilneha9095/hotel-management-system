const express = require("express");

const {
  getDashboardStats,
  getAllBookings,
  updateBookingStatus,
  getAllGuests,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);

router.get(
  "/bookings",
  protect,
  adminOnly,
  getAllBookings
);

router.put(
  "/bookings/:id/status",
  protect,
  adminOnly,
  updateBookingStatus
);

router.get(
  "/guests",
  protect,
  adminOnly,
  getAllGuests
);

router.get(
  "/reviews",
  protect,
  adminOnly,
  getAllReviews
);

router.put(
  "/reviews/:id/status",
  protect,
  adminOnly,
  updateReviewStatus
);

router.delete(
  "/reviews/:id",
  protect,
  adminOnly,
  deleteReview
);

module.exports = router;
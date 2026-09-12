const express = require("express");

const protect = require("../middleware/authMiddleware");
const adminOnly =
  require("../middleware/authMiddleware").adminOnly;

const {
  getDashboardStats,
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/adminController");



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

module.exports = router;
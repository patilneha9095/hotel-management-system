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
const {
  getDashboardStats,
  getAllBookings,
  updateBookingStatus,
  getAllGuests,
} = require("../controllers/adminController");

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

module.exports = router;
const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/bookingController");

const router = express.Router();


// Create booking
router.post(
  "/",
  protect,
  createBooking
);


// Get customer's bookings
router.get(
  "/my",
  protect,
  getMyBookings
);


// Get single booking
router.get(
  "/:id",
  protect,
  getBookingById
);


// Cancel booking
router.put(
  "/:id/cancel",
  protect,
  cancelBooking
);


module.exports = router;
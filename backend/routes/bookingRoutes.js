const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createBooking,
  getMyBookings,
  getBookingById,
} = require("../controllers/bookingController");

const router = express.Router();

router.post(
  "/",
  protect,
  createBooking
);

router.get(
  "/my",
  protect,
  getMyBookings
);

router.get(
  "/:id",
  protect,
  getBookingById
);

module.exports = router;
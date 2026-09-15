const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  adminOnly,
} = require(
  "../middleware/authMiddleware"
);

const {
  createPayment,
  getAllPayments,
  getPaymentByBooking,
} = require(
  "../controllers/paymentController"
);

router.post(
  "/",
  protect,
  createPayment
);

router.get(
  "/",
  protect,
  adminOnly,
  getAllPayments
);

router.get(
  "/booking/:bookingId",
  protect,
  getPaymentByBooking
);

module.exports = router;
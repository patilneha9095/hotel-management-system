const express = require("express");

const {
  getReceptionistDashboard,
  checkInGuest,
  checkOutGuest,
} = require("../controllers/receptionistController");

const protect = require("../middleware/authMiddleware");
const {
  receptionistOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  receptionistOnly,
  getReceptionistDashboard
);

router.put(
  "/bookings/:id/check-in",
  protect,
  receptionistOnly,
  checkInGuest
);

router.put(
  "/bookings/:id/check-out",
  protect,
  receptionistOnly,
  checkOutGuest
);

module.exports = router;
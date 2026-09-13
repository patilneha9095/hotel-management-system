const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  receptionistOnly,
} = require("../middleware/authMiddleware");

const {
  getReceptionistDashboard,
} = require("../controllers/receptionistController");

const {
  getReceptionistDashboard,
  checkInGuest,
  checkOutGuest,
} = require("../controllers/receptionistController");


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
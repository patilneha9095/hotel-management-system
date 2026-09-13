const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  receptionistOnly,
} = require("../middleware/authMiddleware");

const {
  getReceptionistDashboard,
} = require("../controllers/receptionistController");

router.get(
  "/dashboard",
  protect,
  receptionistOnly,
  getReceptionistDashboard
);

module.exports = router;
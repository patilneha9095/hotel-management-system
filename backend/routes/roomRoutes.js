const express = require("express");

const {
  addRoom,
  getRooms,
  getRoomById,
  deleteRoom,
  searchAvailableRooms,
} = require("../controllers/roomController");

const router = express.Router();

router.post("/", addRoom);

router.get("/search", searchAvailableRooms);

router.get("/", getRooms);

router.get("/:id", getRoomById);

router.delete("/:id", deleteRoom);

module.exports = router;
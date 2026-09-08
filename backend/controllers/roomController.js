const Room = require("../models/Room");

// Add Room
const addRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      roomType,
      price,
      capacity,
      bedType,
      description,
      amenities,
      image,
      status,
    } = req.body;

    if (
      !roomNumber ||
      !roomType ||
      !price ||
      !capacity ||
      !bedType ||
      !description
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const existingRoom = await Room.findOne({ roomNumber });

    if (existingRoom) {
      return res.status(400).json({
        message: "Room number already exists",
      });
    }

    const room = await Room.create({
      roomNumber,
      roomType,
      price,
      capacity,
      bedType,
      description,
      amenities,
      image,
      status,
    });

    res.status(201).json({
      message: "Room added successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });

    res.status(200).json({
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Single Room
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json({
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete Room
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    await room.deleteOne();

    res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const searchAvailableRooms = async (req, res) => {
  try {
    const {
      checkIn,
      checkOut,
      guests,
      roomType,
      maxPrice,
    } = req.query;

    if (!checkIn || !checkOut || !guests) {
      return res.status(400).json({
        message:
          "Check-in, check-out and guests are required",
      });
    }

    const Booking = require("../models/Booking");

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        message:
          "Check-out date must be after check-in date",
      });
    }

    const query = {
      capacity: { $gte: Number(guests) },
      status: "Available",
    };

    if (roomType) {
      query.roomType = roomType;
    }

    if (maxPrice) {
      query.price = {
        $lte: Number(maxPrice),
      };
    }

    const rooms = await Room.find(query);

    const bookings = await Booking.find({
      status: {
        $in: [
          "Pending",
          "Confirmed",
          "Checked-in",
        ],
      },

      checkIn: {
        $lt: checkOutDate,
      },

      checkOut: {
        $gt: checkInDate,
      },
    });

    const bookedRoomIds = bookings.map(
      (booking) => booking.room.toString()
    );

    const availableRooms = rooms.filter(
      (room) =>
        !bookedRoomIds.includes(room._id.toString())
    );

    res.status(200).json({
      count: availableRooms.length,
      rooms: availableRooms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addRoom,
  getRooms,
  getRoomById,
  deleteRoom,
  searchAvailableRooms,
};
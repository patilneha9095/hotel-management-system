const Booking = require("../models/Booking");
const Room = require("../models/Room");

// Create Booking
const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
    } = req.body;

    if (
      !roomId ||
      !checkIn ||
      !checkOut ||
      !guests
    ) {
      return res.status(400).json({
        message: "Please provide all booking details",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        message:
          "Check-out date must be after check-in date",
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (Number(guests) > room.capacity) {
      return res.status(400).json({
        message:
          "Number of guests exceeds room capacity",
      });
    }

    if (room.status !== "Available") {
      return res.status(400).json({
        message: "Room is not currently available",
      });
    }

    // Check overlapping bookings
    const existingBooking =
      await Booking.findOne({
        room: roomId,

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

    if (existingBooking) {
      return res.status(400).json({
        message:
          "Room is already booked for these dates",
      });
    }

    // Calculate number of nights
    const difference =
      checkOutDate.getTime() -
      checkInDate.getTime();

    const nights = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    const totalAmount =
      nights * room.price;

    const booking = await Booking.create({
      user: req.user.id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: Number(guests),
      nights,
      totalAmount,
      status: "Pending",
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Get My Bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("room")
      .sort({ createdAt: -1 });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Get Single Booking
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    )
      .populate("room")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
};
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
    } = req.body;

    // Validate required fields
    if (
      !roomId ||
      !checkIn ||
      !checkOut ||
      !guests
    ) {
      return res.status(400).json({
        message:
          "Room, check-in, check-out and guests are required",
      });
    }

    // Convert dates
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    // Validate dates
    if (
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid check-in or check-out date",
      });
    }

    if (startDate >= endDate) {
      return res.status(400).json({
        message:
          "Check-out date must be after check-in date",
      });
    }

    // Validate guests
    if (Number(guests) <= 0) {
      return res.status(400).json({
        message: "Guests must be at least 1",
      });
    }

    // Find room
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Check room capacity
    if (Number(guests) > room.capacity) {
      return res.status(400).json({
        message: `This room can accommodate a maximum of ${room.capacity} guests`,
      });
    }

    // Check room status
    if (room.status !== "Available") {
      return res.status(400).json({
        message:
          "This room is currently not available",
      });
    }

    // Check booking overlap
    const overlappingBooking =
      await Booking.findOne({
        room: roomId,
        status: {
          $nin: [
            "Cancelled",
            "Checked-out",
            "Completed",
          ],
        },
        checkIn: {
          $lt: endDate,
        },
        checkOut: {
          $gt: startDate,
        },
      });

    if (overlappingBooking) {
      return res.status(400).json({
        message:
          "Room is already booked for the selected dates",
      });
    }

    // Calculate number of nights
    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const nights = Math.ceil(
      (endDate - startDate) /
        millisecondsPerDay
    );

    // Calculate total amount
    const totalAmount =
      nights * room.price;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      room: roomId,
      checkIn: startDate,
      checkOut: endDate,
      guests: Number(guests),
      nights,
      totalAmount,
      status: "Pending",
    });

    // Notify customer
    await createNotification({
      user: req.user.id,
      title: "Booking Created",
      message: `Your booking for Room ${room.roomNumber} has been created successfully.`,
      type: "Booking",
      relatedId: booking._id,
    });

    // Find all admins
    const admins = await User.find({
      role: "admin",
    }).select("_id");

    // Notify all admins
    for (const admin of admins) {
      await createNotification({
        user: admin._id,
        title: "New Booking",
        message: `A new booking has been created for Room ${room.roomNumber}.`,
        type: "Booking",
        relatedId: booking._id,
      });
    }

    // Populate booking information
    const populatedBooking =
      await Booking.findById(booking._id)
        .populate("user", "name email")
        .populate(
          "room",
          "roomNumber roomType price capacity bedType"
        );

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create booking",
    });
  }
};

// Get logged-in customer's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate(
        "room",
        "roomNumber roomType price capacity bedType image"
      )
      .sort({ createdAt: -1 });

    res.json({
      bookings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

// Get single booking
const getBookingById = async (req, res) => {
  try {
    const booking =
      await Booking.findById(req.params.id)
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "room",
          "roomNumber roomType price capacity bedType description amenities image status"
        );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Customer can access only their own booking
    if (
      booking.user._id.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to view this booking",
      });
    }

    res.json({
      booking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch booking",
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking =
      await Booking.findById(req.params.id)
        .populate("room", "roomNumber roomType");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Customer can cancel only their own booking
    if (
      booking.user.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to cancel this booking",
      });
    }

    // Prevent cancellation of completed bookings
    if (
      booking.status === "Completed" ||
      booking.status === "Checked-out"
    ) {
      return res.status(400).json({
        message:
          "This booking cannot be cancelled",
      });
    }

    // Prevent cancelling an already cancelled booking
    if (booking.status === "Cancelled") {
      return res.status(400).json({
        message:
          "Booking is already cancelled",
      });
    }

    booking.status = "Cancelled";

    await booking.save();

    // Notify customer
    await createNotification({
      user: req.user.id,
      title: "Booking Cancelled",
      message: `Your booking for Room ${booking.room.roomNumber} has been cancelled.`,
      type: "Booking",
      relatedId: booking._id,
    });

    // Notify admins
    const admins = await User.find({
      role: "admin",
    }).select("_id");

    for (const admin of admins) {
      await createNotification({
        user: admin._id,
        title: "Booking Cancelled",
        message: `A customer has cancelled the booking for Room ${booking.room.roomNumber}.`,
        type: "Booking",
        relatedId: booking._id,
      });
    }

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
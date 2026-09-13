const Booking = require("../models/Booking");

const getReceptionistDashboard = async (req, res) => {
  try {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const arrivals = await Booking.find({
      checkIn: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: {
        $in: ["Confirmed", "Pending"],
      },
    })
      .populate("user", "name email")
      .populate("room", "roomNumber roomType")
      .sort({ checkIn: 1 });

    const departures = await Booking.find({
      checkOut: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: "Checked-in",
    })
      .populate("user", "name email")
      .populate("room", "roomNumber roomType")
      .sort({ checkOut: 1 });

    const stayingGuests = await Booking.find({
      status: "Checked-in",
    })
      .populate("user", "name email")
      .populate("room", "roomNumber roomType")
      .sort({ checkIn: 1 });

    res.json({
      arrivals,
      departures,
      stayingGuests,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load receptionist dashboard",
    });
  }
};
const Room = require("../models/Room");
const checkInGuest = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "Confirmed") {
      return res.status(400).json({
        message:
          "Only confirmed bookings can be checked in",
      });
    }

    const room = await Room.findById(booking.room);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.status !== "Available") {
      return res.status(400).json({
        message: "Room is not available",
      });
    }

    booking.status = "Checked-in";
    await booking.save();

    room.status = "Occupied";
    await room.save();

    const updatedBooking = await Booking.findById(id)
      .populate("user", "name email")
      .populate(
        "room",
        "roomNumber roomType status"
      );

    res.json({
      message: "Guest checked in successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Check-in failed",
    });
  }
};
const checkOutGuest = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "Checked-in") {
      return res.status(400).json({
        message:
          "Only checked-in guests can be checked out",
      });
    }

    const room = await Room.findById(booking.room);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    booking.status = "Checked-out";
    await booking.save();

    room.status = "Cleaning";
    await room.save();

    const updatedBooking = await Booking.findById(id)
      .populate("user", "name email")
      .populate(
        "room",
        "roomNumber roomType status"
      );

    res.json({
      message: "Guest checked out successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Check-out failed",
    });
  }
};

module.exports = {
  getReceptionistDashboard,
  checkInGuest,
  checkOutGuest,
};
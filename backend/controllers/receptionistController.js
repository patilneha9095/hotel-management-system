const Booking = require("../models/Booking");
const Room = require("../models/Room");
const createNotification = require("../utils/createNotification");

// Get receptionist dashboard
const getReceptionistDashboard = async (req, res) => {
  try {
    // Get today's date
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Today's arrivals
    const arrivals = await Booking.find({
      checkIn: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: {
        $in: ["Pending", "Confirmed"],
      },
    })
      .populate("user", "name email phone")
      .populate(
        "room",
        "roomNumber roomType status"
      )
      .sort({ checkIn: 1 });

    // Today's departures
    const departures = await Booking.find({
      checkOut: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: "Checked-in",
    })
      .populate("user", "name email phone")
      .populate(
        "room",
        "roomNumber roomType status"
      )
      .sort({ checkOut: 1 });

    // Currently staying guests
    const stayingGuests = await Booking.find({
      status: "Checked-in",
    })
      .populate("user", "name email phone")
      .populate(
        "room",
        "roomNumber roomType status"
      )
      .sort({ checkIn: 1 });

    res.json({
      arrivals,
      departures,
      stayingGuests,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to fetch receptionist dashboard",
    });
  }
};

// Check-in guest
const checkInGuest = async (req, res) => {
  try {
    const booking =
      await Booking.findById(req.params.id)
        .populate("user", "_id name")
        .populate(
          "room",
          "roomNumber roomType status"
        );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only confirmed bookings can be checked in
    if (booking.status !== "Confirmed") {
      return res.status(400).json({
        message:
          "Only confirmed bookings can be checked in",
      });
    }

    const room = await Room.findById(
      booking.room._id
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Room must be available
    if (room.status !== "Available") {
      return res.status(400).json({
        message:
          "Room is not available for check-in",
      });
    }

    // Update booking
    booking.status = "Checked-in";

    // Update room
    room.status = "Occupied";

    await booking.save();
    await room.save();

    // Notify customer
    await createNotification({
      user: booking.user._id,
      title: "Check-in Completed",
      message: `You have been checked in successfully to Room ${room.roomNumber}.`,
      type: "Check-in",
      relatedId: booking._id,
    });

    res.json({
      message: "Guest checked in successfully",
      booking,
      room,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to check in guest",
    });
  }
};

// Check-out guest
const checkOutGuest = async (req, res) => {
  try {
    const booking =
      await Booking.findById(req.params.id)
        .populate("user", "_id name")
        .populate(
          "room",
          "roomNumber roomType status"
        );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only checked-in guests can be checked out
    if (booking.status !== "Checked-in") {
      return res.status(400).json({
        message:
          "Only checked-in guests can be checked out",
      });
    }

    const room = await Room.findById(
      booking.room._id
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Update booking
    booking.status = "Checked-out";

    // Room needs cleaning after checkout
    room.status = "Cleaning";

    await booking.save();
    await room.save();

    // Notify customer
    await createNotification({
      user: booking.user._id,
      title: "Check-out Completed",
      message: `Your check-out from Room ${room.roomNumber} has been completed.`,
      type: "Check-out",
      relatedId: booking._id,
    });

    res.json({
      message: "Guest checked out successfully",
      booking,
      room,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to check out guest",
    });
  }
};

module.exports = {
  getReceptionistDashboard,
  checkInGuest,
  checkOutGuest,
};
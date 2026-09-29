const Booking = require("../models/Booking");
const Room = require("../models/Room");
const createNotification = require("../utils/createNotification");

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
    const booking =
      await Booking.findById(req.params.id)
        .populate("user", "_id name")
        .populate("room", "roomNumber roomType");

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

    const room = await Room.findById(
      booking.room._id
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.status !== "Available") {
      return res.status(400).json({
        message:
          "Room is not available for check-in",
      });
    }

    booking.status = "Checked-in";

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
const checkOutGuest = async (req, res) => {
  try {
    const booking =
      await Booking.findById(req.params.id)
        .populate("user", "_id name")
        .populate("room", "roomNumber roomType");

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

    const room = await Room.findById(
      booking.room._id
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

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
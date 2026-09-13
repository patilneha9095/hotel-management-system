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

module.exports = {
  getReceptionistDashboard,
};
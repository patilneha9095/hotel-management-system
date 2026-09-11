const Room = require("../models/Room");
const Booking = require("../models/Booking");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();

    const availableRooms = await Room.countDocuments({
      status: "Available",
    });

    const occupiedRooms = await Room.countDocuments({
      status: "Occupied",
    });

    const totalBookings = await Booking.countDocuments();

    const totalGuests = await User.countDocuments({
      role: "customer",
    });

    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: {
            $in: [
              "Confirmed",
              "Checked-in",
              "Checked-out",
              "Completed",
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    const recentBookings = await Booking.find()
      .populate("user", "name email")
      .populate("room", "roomNumber roomType")
      .sort({ createdAt: -1 })
      .limit(5);

    const roomStatus = {
      available: await Room.countDocuments({
        status: "Available",
      }),

      reserved: await Room.countDocuments({
        status: "Reserved",
      }),

      occupied: await Room.countDocuments({
        status: "Occupied",
      }),

      cleaning: await Room.countDocuments({
        status: "Cleaning",
      }),

      maintenance: await Room.countDocuments({
        status: "Maintenance",
      }),
    };

    res.status(200).json({
      stats: {
        totalRooms,
        availableRooms,
        occupiedRooms,
        totalBookings,
        totalGuests,
        totalRevenue,
      },

      recentBookings,

      roomStatus,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
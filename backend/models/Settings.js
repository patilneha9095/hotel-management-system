const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      default: "GrandStay",
      trim: true,
    },

    hotelEmail: {
      type: String,
      default: "",
      trim: true,
    },

    hotelPhone: {
      type: String,
      default: "",
      trim: true,
    },

    hotelAddress: {
      type: String,
      default: "",
      trim: true,
    },

    checkInTime: {
      type: String,
      default: "12:00",
    },

    checkOutTime: {
      type: String,
      default: "11:00",
    },

    cancellationPolicy: {
      type: String,
      default:
        "Bookings can be cancelled before check-in.",
    },

    currency: {
      type: String,
      default: "INR",
    },

    taxPercentage: {
      type: Number,
      default: 0,
    },

    enableOnlinePayment: {
      type: Boolean,
      default: true,
    },

    enableEmailNotifications: {
      type: Boolean,
      default: true,
    },

    enableBookingNotifications: {
      type: Boolean,
      default: true,
    },

    enablePaymentNotifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Settings",
  settingsSchema
);
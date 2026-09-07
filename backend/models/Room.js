const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },

    roomType: {
      type: String,
      required: true,
      enum: ["Single", "Double", "Deluxe", "Suite"],
    },

    price: {
      type: Number,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    bedType: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Available",
        "Reserved",
        "Occupied",
        "Cleaning",
        "Maintenance",
      ],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
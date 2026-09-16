const Review = require("../models/Review");
const Booking = require("../models/Booking");

// Create review
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({
        message: "Booking, rating and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Customer can review only their own booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can review only your own booking",
      });
    }

    // Review only after checkout/completion
    if (
      booking.status !== "Checked-out" &&
      booking.status !== "Completed"
    ) {
      return res.status(400).json({
        message: "You can review only after your stay is completed",
      });
    }

    const existingReview = await Review.findOne({
      booking: bookingId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this booking",
      });
    }

    const review = await Review.create({
      user: req.user.id,
      booking: booking._id,
      room: booking.room,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("room", "roomNumber roomType");

    res.status(201).json({
      message: "Review submitted successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create review",
    });
  }
};

// Get customer's reviews
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user.id,
    })
      .populate("room", "roomNumber roomType")
      .populate("booking", "checkIn checkOut totalAmount status")
      .sort({ createdAt: -1 });

    res.json({
      reviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
};

// Get approved reviews for customer website
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      status: "Approved",
    })
      .populate("user", "name")
      .populate("room", "roomNumber roomType")
      .sort({ createdAt: -1 });

    res.json({
      reviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
};

module.exports = {
  createReview,
  getMyReviews,
  getApprovedReviews,
};
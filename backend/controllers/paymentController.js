const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

const createPayment = async (req, res) => {
  try {
    const {
      bookingId,
      paidAmount,
      paymentMethod,
      transactionId,
    } = req.body;

    if (!bookingId || paidAmount === undefined) {
      return res.status(400).json({
        message:
          "Booking and paid amount are required",
      });
    }

    const booking = await Booking.findById(
      bookingId
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    let payment = await Payment.findOne({
      booking: bookingId,
    });

    const totalAmount = booking.totalAmount;

    if (!payment) {
      payment = new Payment({
        booking: bookingId,
        user: booking.user,
        amount: totalAmount,
      });
    }

    const newPaidAmount =
      payment.paidAmount +
      Number(paidAmount);

    if (newPaidAmount > totalAmount) {
      return res.status(400).json({
        message:
          "Paid amount cannot exceed booking amount",
      });
    }

    payment.paidAmount = newPaidAmount;

    payment.remainingAmount =
      totalAmount - newPaidAmount;

    payment.paymentMethod =
      paymentMethod || "Cash";

    payment.transactionId =
      transactionId || "";

    if (newPaidAmount === 0) {
      payment.paymentStatus = "Pending";
    } else if (newPaidAmount < totalAmount) {
      payment.paymentStatus =
        "Partially Paid";
    } else {
      payment.paymentStatus = "Paid";
      payment.paidAt = new Date();
    }

    await payment.save();

    const populatedPayment =
      await Payment.findById(payment._id)
        .populate("user", "name email")
        .populate("booking");

    res.status(200).json({
      message: "Payment updated successfully",
      payment: populatedPayment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update payment",
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate({
        path: "booking",
        populate: {
          path: "room",
          select: "roomNumber roomType",
        },
      })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch payments",
    });
  }
};

const getPaymentByBooking = async (
  req,
  res
) => {
  try {
    const payment = await Payment.findOne({
      booking: req.params.bookingId,
    })
      .populate("user", "name email")
      .populate("booking");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.json(payment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch payment",
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentByBooking,
};
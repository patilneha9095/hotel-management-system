const Settings = require("../models/Settings");

// Get settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({
      settings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch settings",
    });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const {
      hotelName,
      hotelEmail,
      hotelPhone,
      hotelAddress,
      checkInTime,
      checkOutTime,
      cancellationPolicy,
      currency,
      taxPercentage,
      enableOnlinePayment,
      enableEmailNotifications,
      enableBookingNotifications,
      enablePaymentNotifications,
    } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    settings.hotelName =
      hotelName ?? settings.hotelName;

    settings.hotelEmail =
      hotelEmail ?? settings.hotelEmail;

    settings.hotelPhone =
      hotelPhone ?? settings.hotelPhone;

    settings.hotelAddress =
      hotelAddress ?? settings.hotelAddress;

    settings.checkInTime =
      checkInTime ?? settings.checkInTime;

    settings.checkOutTime =
      checkOutTime ?? settings.checkOutTime;

    settings.cancellationPolicy =
      cancellationPolicy ??
      settings.cancellationPolicy;

    settings.currency =
      currency ?? settings.currency;

    settings.taxPercentage =
      taxPercentage ?? settings.taxPercentage;

    settings.enableOnlinePayment =
      enableOnlinePayment ??
      settings.enableOnlinePayment;

    settings.enableEmailNotifications =
      enableEmailNotifications ??
      settings.enableEmailNotifications;

    settings.enableBookingNotifications =
      enableBookingNotifications ??
      settings.enableBookingNotifications;

    settings.enablePaymentNotifications =
      enablePaymentNotifications ??
      settings.enablePaymentNotifications;

    await settings.save();

    res.json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update settings",
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
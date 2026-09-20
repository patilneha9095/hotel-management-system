const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hotel Management System API",
  });
});

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/rooms",
  require("./routes/roomRoutes")
);

app.use(
  "/api/bookings",
  require("./routes/bookingRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);
app.use(
  "/api/receptionist",
  require("./routes/receptionistRoutes")
);

app.use(
  "/api/payments",
  require("./routes/paymentRoutes")
);
app.use(
  "/api/reviews",
  require("./routes/reviewRoutes")
);
app.use(
  "/api/notifications",
  require("./routes/notificationRoutes")
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
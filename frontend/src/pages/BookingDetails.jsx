import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function BookingDetails() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBooking(response.data.booking);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <h2>Loading booking...</h2>;
  }


  if (!booking) {
    return (
      <div>
        <h2>Booking not found</h2>

        <Link to="/customer/dashboard">
          Back to Dashboard
        </Link>
      </div>
    );
  }


  return (
    <div className="booking-details-page">

      <div className="booking-details-header">

        <div>
          <h1>Booking Details</h1>

          <p>
            Booking ID: {booking._id}
          </p>
        </div>

        <span
          className={`booking-status ${booking.status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {booking.status}
        </span>

      </div>


      <div className="booking-details-card">

        <div className="booking-room-image">

          <img
            src={
              booking.room?.image ||
              "https://images.unsplash.com/photo-1566665797739-1674de7a421a"
            }
            alt={booking.room?.roomType}
          />

        </div>


        <div className="booking-room-info">

          <h2>
            {booking.room?.roomType} Room
          </h2>

          <p>
            Room Number:{" "}
            {booking.room?.roomNumber}
          </p>

          <p>
            Bed Type:{" "}
            {booking.room?.bedType}
          </p>

          <p>
            Capacity:{" "}
            {booking.room?.capacity} guests
          </p>

        </div>

      </div>


      <div className="booking-summary">

        <h2>Booking Summary</h2>

        <div className="summary-row">
          <span>Check-in</span>

          <strong>
            {new Date(
              booking.checkIn
            ).toLocaleDateString()}
          </strong>
        </div>

        <div className="summary-row">
          <span>Check-out</span>

          <strong>
            {new Date(
              booking.checkOut
            ).toLocaleDateString()}
          </strong>
        </div>

        <div className="summary-row">
          <span>Guests</span>

          <strong>
            {booking.guests}
          </strong>
        </div>

        <div className="summary-row">
          <span>Nights</span>

          <strong>
            {booking.nights}
          </strong>
        </div>

        <div className="summary-row">
          <span>Total Amount</span>

          <strong>
            ₹{booking.totalAmount}
          </strong>
        </div>

      </div>


      <Link
        to="/customer/dashboard"
        className="back-dashboard-btn"
      >
        Back to Dashboard
      </Link>

    </div>
  );
}

export default BookingDetails;
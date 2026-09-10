import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/bookings/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(response.data.bookings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking cancelled successfully");

      fetchBookings();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to cancel booking"
      );
    }
  };

  if (loading) {
    return <h2>Loading bookings...</h2>;
  }

  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.status === "Pending" ||
      booking.status === "Confirmed"
  );

  return (
    <div className="customer-dashboard">

      <div className="dashboard-header">
        <div>
          <h1>
            Welcome, {user?.name}
          </h1>

          <p>
            Manage your hotel bookings
          </p>
        </div>

        <Link
          to="/rooms"
          className="dashboard-book-btn"
        >
          Book a Room
        </Link>
      </div>


      <div className="dashboard-stats">

        <div className="dashboard-stat">
          <h3>{bookings.length}</h3>
          <p>Total Bookings</p>
        </div>

        <div className="dashboard-stat">
          <h3>{upcomingBookings.length}</h3>
          <p>Upcoming</p>
        </div>

        <div className="dashboard-stat">
          <h3>
            {
              bookings.filter(
                (booking) =>
                  booking.status === "Completed"
              ).length
            }
          </h3>
          <p>Completed</p>
        </div>

      </div>


      <section className="booking-section">

        <h2>My Bookings</h2>

        {bookings.length === 0 ? (
          <div className="empty-bookings">
            <h3>No bookings yet</h3>

            <p>
              You haven't made any hotel bookings.
            </p>

            <Link to="/rooms">
              Explore Rooms
            </Link>
          </div>
        ) : (
          <div className="booking-list">

            {bookings.map((booking) => (

              <div
                className="booking-card"
                key={booking._id}
              >

                <div className="booking-image">

                  <img
                    src={
                      booking.room?.image ||
                      "https://images.unsplash.com/photo-1566665797739-1674de7a421a"
                    }
                    alt={booking.room?.roomType}
                  />

                </div>


                <div className="booking-info">

                  <h3>
                    {booking.room?.roomType} Room
                  </h3>

                  <p>
                    Room No:{" "}
                    {booking.room?.roomNumber}
                  </p>

                  <p>
                    Check-in:{" "}
                    {new Date(
                      booking.checkIn
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    Check-out:{" "}
                    {new Date(
                      booking.checkOut
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    Guests: {booking.guests}
                  </p>

                  <h3>
                    ₹{booking.totalAmount}
                  </h3>

                </div>


                <div className="booking-actions">

                  <span
                    className={`booking-status ${booking.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {booking.status}
                  </span>


                  <Link
                    to={`/customer/bookings/${booking._id}`}
                    className="view-booking-btn"
                  >
                    View Details
                  </Link>


                  {(
                    booking.status === "Pending" ||
                    booking.status === "Confirmed"
                  ) && (
                    <button
                      onClick={() =>
                        cancelBooking(
                          booking._id
                        )
                      }
                      className="cancel-booking-btn"
                    >
                      Cancel Booking
                    </button>
                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default CustomerDashboard;
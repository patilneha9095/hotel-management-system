import { useEffect, useState } from "react";
import axios from "axios";

function Guests() {
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/guests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGuests(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(search.toLowerCase()) ||
      guest.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Guests</h1>
          <p>Manage hotel guests and their booking history.</p>
        </div>
      </div>

      <div className="booking-filters">
        <input
          type="text"
          placeholder="Search guest by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="booking-table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Bookings</th>
              <th>Current Room</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest) => (
                <tr key={guest._id}>
                  <td>{guest.name}</td>
                  <td>{guest.email}</td>
                  <td>{guest.phone}</td>
                  <td>{guest.totalBookings}</td>
                  <td>{guest.currentRoom}</td>
                  <td>{guest.currentBookingStatus}</td>
                  <td>
                    <button
                      className="small-btn"
                      onClick={() => setSelectedGuest(guest)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  No guests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedGuest && (
        <div className="guest-details-card">
          <div className="guest-details-header">
            <div>
              <h2>{selectedGuest.name}</h2>
              <p>{selectedGuest.email}</p>
            </div>

            <button
              className="small-btn"
              onClick={() => setSelectedGuest(null)}
            >
              Close
            </button>
          </div>

          <h3>Booking History</h3>

          {selectedGuest.bookingHistory.length > 0 ? (
            <div className="booking-history">
              {selectedGuest.bookingHistory.map((booking) => (
                <div
                  className="history-item"
                  key={booking._id}
                >
                  <p>
                    <strong>Booking:</strong>{" "}
                    {booking._id.slice(-8)}
                  </p>

                  <p>
                    <strong>Room:</strong>{" "}
                    {booking.room?.roomNumber || "N/A"}
                  </p>

                  <p>
                    <strong>Check-in:</strong>{" "}
                    {new Date(
                      booking.checkIn
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Check-out:</strong>{" "}
                    {new Date(
                      booking.checkOut
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Amount:</strong> ₹
                    {booking.totalAmount}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {booking.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No booking history available.</p>
          )}
        </div>
      )}
      <div className="booking-history">

  {selectedGuest.bookingHistory.length > 0 ? (
    selectedGuest.bookingHistory.map(
      (booking) => (
        <div
          className="history-item"
          key={booking._id}
        >
          <div>
            <strong>
              Room{" "}
              {booking.room?.roomNumber ||
                "N/A"}
            </strong>

            <p>
              {booking.room?.roomType ||
                "N/A"}
            </p>
          </div>

          <div>
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
          </div>

          <div>
            <p>
              Amount: ₹
              {booking.totalAmount}
            </p>

            <strong>
              {booking.status}
            </strong>
          </div>
        </div>
      )
    )
  ) : (
    <p>No booking history available.</p>
  )}

</div>
    </div>
    
  );
}

export default Guests;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  const [status, setStatus] = useState("All");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [status]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          params: {
            status,
            search,
          },
        }
      );

      setBookings(response.data.bookings);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    fetchBookings();
  };

  const updateStatus = async (
    bookingId,
    newStatus
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/bookings/${bookingId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking status updated");

      fetchBookings();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update booking"
      );
    }
  };

  const openInvoice = (bookingId) => {
    navigate(`/admin/invoice/${bookingId}`);
  };

  return (
    <div className="admin-dashboard">

      {/* Page Header */}

      <div className="admin-header">

        <div>
          <h1>Booking Management</h1>

          <p>
            View and manage all hotel bookings
          </p>
        </div>

      </div>

      {/* Filters */}

      <div className="booking-filters">

        <form onSubmit={handleSearch}>

          <input
            type="text"
            placeholder="Search guest, email, room..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button type="submit">
            Search
          </button>

        </form>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

          <option value="Checked-in">
            Checked-in
          </option>

          <option value="Checked-out">
            Checked-out
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>

      </div>

      {/* Booking Table */}

      <div className="admin-panel">

        {loading ? (

          <p>Loading bookings...</p>

        ) : bookings.length === 0 ? (

          <p>No bookings found.</p>

        ) : (

          <div className="booking-table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Booking ID</th>

                  <th>Guest</th>

                  <th>Room</th>

                  <th>Check-in</th>

                  <th>Check-out</th>

                  <th>Guests</th>

                  <th>Amount</th>

                  <th>Status</th>

                  <th>Invoice</th>

                </tr>

              </thead>

              <tbody>

                {bookings.map((booking) => (

                  <tr key={booking._id}>

                    {/* Booking ID */}

                    <td>
                      #{booking._id.slice(-6)}
                    </td>

                    {/* Guest */}

                    <td>

                      <strong>
                        {booking.user?.name ||
                          "N/A"}
                      </strong>

                      <br />

                      <small>
                        {booking.user?.email ||
                          "N/A"}
                      </small>

                    </td>

                    {/* Room */}

                    <td>

                      {booking.room?.roomType ||
                        "N/A"}

                      <br />

                      Room{" "}
                      {booking.room?.roomNumber ||
                        "N/A"}

                    </td>

                    {/* Check-in */}

                    <td>

                      {booking.checkIn
                        ? new Date(
                            booking.checkIn
                          ).toLocaleDateString()
                        : "N/A"}

                    </td>

                    {/* Check-out */}

                    <td>

                      {booking.checkOut
                        ? new Date(
                            booking.checkOut
                          ).toLocaleDateString()
                        : "N/A"}

                    </td>

                    {/* Guests */}

                    <td>
                      {booking.guests}
                    </td>

                    {/* Amount */}

                    <td>
                      ₹
                      {Number(
                        booking.totalAmount || 0
                      ).toLocaleString()}
                    </td>

                    {/* Status */}

                    <td>

                      <select
                        value={
                          booking.status
                        }
                        onChange={(e) =>
                          updateStatus(
                            booking._id,
                            e.target.value
                          )
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                        <option value="Checked-in">
                          Checked-in
                        </option>

                        <option value="Checked-out">
                          Checked-out
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                      </select>

                    </td>

                    {/* Invoice */}

                    <td>

                      <button
                        className="small-btn"
                        onClick={() =>
                          openInvoice(
                            booking._id
                          )
                        }
                      >
                        Invoice
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminBookings;


import { useEffect, useState } from "react";
import axios from "axios";

function ReceptionistDashboard() {
  const [data, setData] = useState({
    arrivals: [],
    departures: [],
    stayingGuests: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/receptionist/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch receptionist dashboard:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // Check-in / Check-out
  const updateBooking = async (bookingId, action) => {
    try {
      const token = localStorage.getItem("token");

      let endpoint;

      if (action === "check-in") {
        endpoint = `/api/receptionist/bookings/${bookingId}/check-in`;
      } else {
        endpoint = `/api/receptionist/bookings/${bookingId}/check-out`;
      }

      const response = await axios.put(
        `http://localhost:5000${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      // Refresh dashboard
      fetchDashboard();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Loading receptionist dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* Page Header */}

      <div className="page-header">
        <div>
          <h1>Receptionist Dashboard</h1>

          <p>
            Manage today's hotel arrivals, departures and
            guests.
          </p>
        </div>

        <button
          className="small-btn"
          onClick={fetchDashboard}
        >
          Refresh
        </button>
      </div>

      {/* Dashboard Cards */}

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Today's Arrivals</h3>
          <p>{data.arrivals.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Today's Departures</h3>
          <p>{data.departures.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Currently Staying</h3>
          <p>{data.stayingGuests.length}</p>
        </div>

      </div>

      {/* Today's Arrivals */}

      <section className="dashboard-section">

        <h2>Today's Arrivals</h2>

        <div className="booking-table-wrapper">

          <table className="booking-table">

            <thead>
              <tr>
                <th>Guest</th>
                <th>Email</th>
                <th>Room</th>
                <th>Room Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {data.arrivals.length > 0 ? (

                data.arrivals.map((booking) => (

                  <tr key={booking._id}>

                    <td>
                      {booking.user?.name || "N/A"}
                    </td>

                    <td>
                      {booking.user?.email || "N/A"}
                    </td>

                    <td>
                      {booking.room?.roomNumber || "N/A"}
                    </td>

                    <td>
                      {booking.room?.roomType || "N/A"}
                    </td>

                    <td>
                      {booking.status}
                    </td>

                    <td>

                      {booking.status === "Confirmed" ? (

                        <button
                          className="small-btn"
                          onClick={() =>
                            updateBooking(
                              booking._id,
                              "check-in"
                            )
                          }
                        >
                          Check-in
                        </button>

                      ) : (
                        "-"
                      )}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="6">
                    No arrivals today.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* Today's Departures */}

      <section className="dashboard-section">

        <h2>Today's Departures</h2>

        <div className="booking-table-wrapper">

          <table className="booking-table">

            <thead>

              <tr>
                <th>Guest</th>
                <th>Email</th>
                <th>Room</th>
                <th>Room Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {data.departures.length > 0 ? (

                data.departures.map((booking) => (

                  <tr key={booking._id}>

                    <td>
                      {booking.user?.name || "N/A"}
                    </td>

                    <td>
                      {booking.user?.email || "N/A"}
                    </td>

                    <td>
                      {booking.room?.roomNumber || "N/A"}
                    </td>

                    <td>
                      {booking.room?.roomType || "N/A"}
                    </td>

                    <td>
                      {booking.status}
                    </td>

                    <td>

                      {booking.status === "Checked-in" ? (

                        <button
                          className="small-btn"
                          onClick={() =>
                            updateBooking(
                              booking._id,
                              "check-out"
                            )
                          }
                        >
                          Check-out
                        </button>

                      ) : (
                        "-"
                      )}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="6">
                    No departures today.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* Currently Staying */}

      <section className="dashboard-section">

        <h2>Currently Staying</h2>

        <div className="booking-table-wrapper">

          <table className="booking-table">

            <thead>

              <tr>
                <th>Guest</th>
                <th>Email</th>
                <th>Room</th>
                <th>Room Type</th>
                <th>Check-in</th>
                <th>Check-out</th>
              </tr>

            </thead>

            <tbody>

              {data.stayingGuests.length > 0 ? (

                data.stayingGuests.map((booking) => (

                  <tr key={booking._id}>

                    <td>
                      {booking.user?.name || "N/A"}
                    </td>

                    <td>
                      {booking.user?.email || "N/A"}
                    </td>

                    <td>
                      {booking.room?.roomNumber || "N/A"}
                    </td>

                    <td>
                      {booking.room?.roomType || "N/A"}
                    </td>

                    <td>
                      {new Date(
                        booking.checkIn
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {new Date(
                        booking.checkOut
                      ).toLocaleDateString()}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="6">
                    No guests currently staying.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default ReceptionistDashboard;
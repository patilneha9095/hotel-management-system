import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalBookings: 0,
    totalGuests: 0,
    totalRevenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);

  const [roomStatus, setRoomStatus] = useState({
    available: 0,
    reserved: 0,
    occupied: 0,
    cleaning: 0,
    maintenance: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(response.data.stats);
      setRecentBookings(response.data.recentBookings);
      setRoomStatus(response.data.roomStatus);
    } catch (error) {
      console.error(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );

      alert(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Hotel management overview</p>
        </div>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Rooms</h3>
          <h2>{stats.totalRooms}</h2>
        </div>

        <div className="stat-card">
          <h3>Available Rooms</h3>
          <h2>{stats.availableRooms}</h2>
        </div>

        <div className="stat-card">
          <h3>Occupied Rooms</h3>
          <h2>{stats.occupiedRooms}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Bookings</h3>
          <h2>{stats.totalBookings}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Guests</h3>
          <h2>{stats.totalGuests}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <h2>
            ₹{stats.totalRevenue.toLocaleString()}
          </h2>
        </div>

      </div>

      <div className="admin-sections">

        <div className="admin-panel">
          <h2>Recent Bookings</h2>

          {recentBookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id}>

                    <td>
                      #{booking._id.slice(-6)}
                    </td>

                    <td>
                      {booking.user?.name ||
                        "Unknown"}
                    </td>

                    <td>
                      {booking.room?.roomType}{" "}
                      {booking.room?.roomNumber}
                    </td>

                    <td>
                      {new Date(
                        booking.checkIn
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {booking.status}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-panel">

          <h2>Room Status</h2>

          <div className="room-status">

            <p>
              <span>Available</span>
              <strong>
                {roomStatus.available}
              </strong>
            </p>

            <p>
              <span>Reserved</span>
              <strong>
                {roomStatus.reserved}
              </strong>
            </p>

            <p>
              <span>Occupied</span>
              <strong>
                {roomStatus.occupied}
              </strong>
            </p>

            <p>
              <span>Cleaning</span>
              <strong>
                {roomStatus.cleaning}
              </strong>
            </p>

            <p>
              <span>Maintenance</span>
              <strong>
                {roomStatus.maintenance}
              </strong>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
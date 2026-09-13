import { useEffect, useState } from "react";
import axios from "axios";

function ReceptionistDashboard() {
  const [data, setData] = useState({
    arrivals: [],
    departures: [],
    stayingGuests: [],
  });

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
      console.error(error);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Receptionist Dashboard</h1>
          <p>
            Manage today's hotel arrivals, departures and guests.
          </p>
        </div>
      </div>

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
              </tr>
            </thead>

            <tbody>
              {data.arrivals.length > 0 ? (
                data.arrivals.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.user?.name}</td>
                    <td>{booking.user?.email}</td>
                    <td>
                      {booking.room?.roomNumber}
                    </td>
                    <td>
                      {booking.room?.roomType}
                    </td>
                    <td>{booking.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    No arrivals today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

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
              </tr>
            </thead>

            <tbody>
              {data.departures.length > 0 ? (
                data.departures.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.user?.name}</td>
                    <td>{booking.user?.email}</td>
                    <td>
                      {booking.room?.roomNumber}
                    </td>
                    <td>
                      {booking.room?.roomType}
                    </td>
                    <td>{booking.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    No departures today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Currently Staying</h2>

        <div className="booking-table-wrapper">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Guest</th>
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
                    <td>{booking.user?.name}</td>

                    <td>
                      {booking.room?.roomNumber}
                    </td>

                    <td>
                      {booking.room?.roomType}
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
                  <td colSpan="5">
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
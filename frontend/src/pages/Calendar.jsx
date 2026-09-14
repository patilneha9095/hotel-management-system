import { useEffect, useState } from "react";
import axios from "axios";

function Calendar() {
  const [bookings, setBookings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const getBookingsForDate = (day) => {
    return bookings.filter((booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);

      const date = new Date(year, month, day);

      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      return date >= checkIn && date < checkOut;
    });
  };

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Loading calendar...</h1>
      </div>
    );
  }

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Reservation Calendar</h1>
          <p>
            View hotel reservations and room occupancy by date.
          </p>
        </div>

        <button
          className="small-btn"
          onClick={fetchBookings}
        >
          Refresh
        </button>
      </div>

      <div className="calendar-container">

        <div className="calendar-header">

          <button
            className="small-btn"
            onClick={previousMonth}
          >
            ← Previous
          </button>

          <h2>
            {monthName} {year}
          </h2>

          <div className="calendar-header-actions">
            <button
              className="small-btn"
              onClick={today}
            >
              Today
            </button>

            <button
              className="small-btn"
              onClick={nextMonth}
            >
              Next →
            </button>
          </div>

        </div>

        <div className="calendar-grid">

          {[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ].map((day) => (
            <div
              key={day}
              className="calendar-day-name"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => {

            if (!day) {
              return (
                <div
                  key={index}
                  className="calendar-cell empty"
                />
              );
            }

            const dayBookings =
              getBookingsForDate(day);

            const isToday =
              new Date().toDateString() ===
              new Date(year, month, day).toDateString();

            return (
              <div
                key={day}
                className={`calendar-cell ${
                  isToday ? "calendar-today" : ""
                }`}
              >

                <div className="calendar-date">
                  {day}
                </div>

                <div className="calendar-bookings">

                  {dayBookings.length === 0 ? (
                    <span className="no-booking">
                      No booking
                    </span>
                  ) : (
                    dayBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="calendar-booking"
                      >
                        <strong>
                          Room{" "}
                          {booking.room?.roomNumber ||
                            "N/A"}
                        </strong>

                        <span>
                          {booking.user?.name ||
                            "Guest"}
                        </span>

                        <small>
                          {booking.status}
                        </small>
                      </div>
                    ))
                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default Calendar;
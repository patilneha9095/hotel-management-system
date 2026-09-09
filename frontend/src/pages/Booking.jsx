import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const room = location.state?.room;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [loading, setLoading] = useState(false);

  if (!room) {
    return (
      <div>
        <h2>Room information not found.</h2>
      </div>
    );
  }

  const calculateNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference =
      end.getTime() - start.getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  const nights = calculateNights();

  const totalAmount =
    nights * room.price;

  const handleBooking = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login before booking.");
      navigate("/login");
      return;
    }

    if (nights <= 0) {
      alert(
        "Please select valid check-in and check-out dates."
      );
      return;
    }

    if (Number(guests) > room.capacity) {
      alert(
        "Number of guests exceeds room capacity."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          roomId: room._id,
          checkIn,
          checkOut,
          guests,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Booking created successfully!"
      );

      navigate("/customer/bookings");

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">

      <h1>Book Your Room</h1>

      <div className="booking-container">

        <div className="booking-room">
          <img
            src={room.image}
            alt={room.roomType}
          />

          <h2>
            {room.roomType} Room
          </h2>

          <p>
            Room Number: {room.roomNumber}
          </p>

          <p>
            ₹{room.price} / night
          </p>

          <p>
            Capacity: {room.capacity}
          </p>

          <p>
            Bed: {room.bedType}
          </p>
        </div>


        <form
          className="booking-form"
          onSubmit={handleBooking}
        >

          <label>
            Check-in
          </label>

          <input
            type="date"
            value={checkIn}
            onChange={(e) =>
              setCheckIn(e.target.value)
            }
            required
          />


          <label>
            Check-out
          </label>

          <input
            type="date"
            value={checkOut}
            onChange={(e) =>
              setCheckOut(e.target.value)
            }
            required
          />


          <label>
            Guests
          </label>

          <input
            type="number"
            min="1"
            max={room.capacity}
            value={guests}
            onChange={(e) =>
              setGuests(e.target.value)
            }
            required
          />


          <div className="booking-summary">

            <p>
              Price per night:
              ₹{room.price}
            </p>

            <p>
              Nights:
              {nights}
            </p>

            <h2>
              Total:
              ₹{totalAmount}
            </h2>

          </div>


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : "Confirm Booking"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Booking;
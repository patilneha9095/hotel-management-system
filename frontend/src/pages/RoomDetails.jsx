import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/rooms/${id}`
      );

      setRoom(response.data.room);
    } catch (error) {
      console.error(
        "Failed to fetch room",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      alert(
        "Please login before booking."
      );

      navigate("/login");

      return;
    }

    navigate("/booking", {
      state: {
        room,
      },
    });
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!room) {
    return <h2>Room not found</h2>;
  }

  return (
    <div className="room-details">

      <img
        src={room.image}
        alt={room.roomType}
      />

      <div>
        <h1>
          {room.roomType} Room
        </h1>

        <p>
          Room Number: {room.roomNumber}
        </p>

        <p>
          ₹{room.price} / night
        </p>

        <p>
          Capacity: {room.capacity} guests
        </p>

        <p>
          Bed Type: {room.bedType}
        </p>

        <p>
          {room.description}
        </p>

        <h3>Amenities</h3>

        <ul>
          {room.amenities.map(
            (amenity, index) => (
              <li key={index}>
                {amenity}
              </li>
            )
          )}
        </ul>

        <p>
          Status: {room.status}
        </p>

        {room.status === "Available" && (
          <button
            onClick={handleBookNow}
            className="book-btn"
          >
            Book Now
          </button>
        )}

      </div>

    </div>
  );
}

export default RoomDetails;
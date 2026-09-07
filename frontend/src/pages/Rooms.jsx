import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/rooms"
      );

      setRooms(response.data.rooms);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading rooms...</h2>;
  }

  return (
    <div className="rooms-page">
      <h1>Our Rooms</h1>

      <div className="rooms-grid">
        {rooms.map((room) => (
          <div className="room-card" key={room._id}>
            <img
              src={room.image}
              alt={room.roomType}
            />

            <div className="room-card-content">
              <h2>{room.roomType} Room</h2>

              <p>{room.description}</p>

              <p>
                <strong>₹{room.price}</strong> / night
              </p>

              <p>
                Guests: {room.capacity}
              </p>

              <p>
                Bed: {room.bedType}
              </p>

              <p>
                Status: {room.status}
              </p>

              <Link
                to={`/rooms/${room._id}`}
                className="book-btn"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rooms;
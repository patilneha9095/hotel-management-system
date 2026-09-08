import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomType: "",
    maxPrice: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);

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

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!filters.checkIn || !filters.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/rooms/search",
        {
          params: filters,
        }
      );

      setRooms(response.data.rooms);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Search failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rooms-page">

      <h1>Find Your Perfect Room</h1>

      <form
        className="room-search-form"
        onSubmit={handleSearch}
      >
        <div>
          <label>Check-in</label>

          <input
            type="date"
            name="checkIn"
            value={filters.checkIn}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Check-out</label>

          <input
            type="date"
            name="checkOut"
            value={filters.checkOut}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Guests</label>

          <input
            type="number"
            name="guests"
            min="1"
            value={filters.guests}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Room Type</label>

          <select
            name="roomType"
            value={filters.roomType}
            onChange={handleChange}
          >
            <option value="">All Rooms</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
          </select>
        </div>

        <div>
          <label>Maximum Price</label>

          <input
            type="number"
            name="maxPrice"
            placeholder="₹"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          Search Rooms
        </button>
      </form>

      {loading ? (
        <h2>Searching rooms...</h2>
      ) : (
        <div className="rooms-grid">
          {rooms.length === 0 ? (
            <h2>
              No rooms available for your search.
            </h2>
          ) : (
            rooms.map((room) => (
              <div
                className="room-card"
                key={room._id}
              >
                <img
                  src={room.image}
                  alt={room.roomType}
                />

                <div className="room-card-content">

                  <h2>
                    {room.roomType} Room
                  </h2>

                  <p>
                    {room.description}
                  </p>

                  <p>
                    <strong>
                      ₹{room.price}
                    </strong>{" "}
                    / night
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
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Rooms;
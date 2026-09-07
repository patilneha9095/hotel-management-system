import { useState } from "react";
import axios from "axios";

function AddRoom() {
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "Single",
    price: "",
    capacity: "",
    bedType: "",
    description: "",
    amenities: "",
    image: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/rooms",
        {
          ...formData,
          price: Number(formData.price),
          capacity: Number(formData.capacity),
          amenities: formData.amenities
            .split(",")
            .map((item) => item.trim()),
        }
      );

      alert("Room added successfully");

      setFormData({
        roomNumber: "",
        roomType: "Single",
        price: "",
        capacity: "",
        bedType: "",
        description: "",
        amenities: "",
        image: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add room"
      );
    }
  };

  return (
    <div className="add-room-page">
      <h1>Add New Room</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="roomNumber"
          placeholder="Room Number"
          value={formData.roomNumber}
          onChange={handleChange}
        />

        <select
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
        >
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Suite">Suite</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price per night"
          value={formData.price}
          onChange={handleChange}
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
        />

        <input
          type="text"
          name="bedType"
          placeholder="Bed Type"
          value={formData.bedType}
          onChange={handleChange}
        />

        <input
          type="text"
          name="amenities"
          placeholder="Amenities: WiFi, AC, TV"
          value={formData.amenities}
          onChange={handleChange}
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Room Description"
          value={formData.description}
          onChange={handleChange}
        />

        <button type="submit">
          Add Room
        </button>
      </form>
    </div>
  );
}

export default AddRoom;
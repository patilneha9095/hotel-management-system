import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
function Home() {
  return (
    <div>
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <p className="hero-subtitle">WELCOME TO GRANDSTAY</p>

          <h1>
            Stay. Relax.
            <br />
            Experience Luxury.
          </h1>

          <p className="hero-description">
            Discover comfortable rooms, exceptional hospitality,
            and unforgettable stays.
          </p>

          <button className="hero-btn">
            Explore Rooms
          </button>
        </div>
      </section>
      <section className="booking-search">
  <div className="search-item">
    <label>Check In</label>
    <input type="date" />
  </div>

  <div className="search-item">
    <label>Check Out</label>
    <input type="date" />
  </div>

  <div className="search-item">
    <label>Guests</label>
    <select>
      <option>1 Guest</option>
      <option>2 Guests</option>
      <option>3 Guests</option>
      <option>4 Guests</option>
    </select>
  </div>

  <button className="search-btn">
    Search Rooms
  </button>
</section>
<section className="featured-section">
  <div className="section-heading">
    <p>OUR ROOMS</p>

    <h2>Featured Rooms</h2>

    <span>
      Choose from our carefully designed rooms and suites.
    </span>
  </div>

  <div className="rooms-grid">

    <div className="room-card">
      <div className="room-image">
        <img
          src="https://images.unsplash.com/photo-1566665797739-1674de7a421a"
          alt="Deluxe Room"
        />
      </div>

      <div className="room-info">
        <h3>Deluxe Room</h3>

        <p>
          Comfortable room with a modern interior and beautiful views.
        </p>

        <div className="room-bottom">
          <strong>₹3,500 / night</strong>

          <button>View Room</button>
        </div>
      </div>
    </div>


    <div className="room-card">
      <div className="room-image">
        <img
          src="https://images.unsplash.com/photo-1590490360182-c33d57733427"
          alt="Luxury Suite"
        />
      </div>

      <div className="room-info">
        <h3>Luxury Suite</h3>

        <p>
          Spacious luxury suite designed for a premium experience.
        </p>

        <div className="room-bottom">
          <strong>₹6,500 / night</strong>

          <button>View Room</button>
        </div>
      </div>
    </div>


    <div className="room-card">
      <div className="room-image">
        <img
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
          alt="Executive Room"
        />
      </div>

      <div className="room-info">
        <h3>Executive Room</h3>

        <p>
          Elegant room with modern facilities for business travelers.
        </p>

        <div className="room-bottom">
          <strong>₹4,500 / night</strong>

          <button>View Room</button>
        </div>
      </div>
    </div>

  </div>
</section>

<section className="amenities-section">

  <div className="section-heading">
    <p>HOTEL FACILITIES</p>
    <h2>Everything You Need</h2>
  </div>

  <div className="amenities-grid">

    <div className="amenity">
      <div className="amenity-icon">📶</div>
      <h3>Free Wi-Fi</h3>
      <p>High-speed internet throughout the hotel.</p>
    </div>

    <div className="amenity">
      <div className="amenity-icon">🏊</div>
      <h3>Swimming Pool</h3>
      <p>Relax and enjoy our premium swimming pool.</p>
    </div>

    <div className="amenity">
      <div className="amenity-icon">🍽️</div>
      <h3>Restaurant</h3>
      <p>Enjoy delicious meals prepared by our chefs.</p>
    </div>

    <div className="amenity">
      <div className="amenity-icon">🚗</div>
      <h3>Free Parking</h3>
      <p>Safe and convenient parking for our guests.</p>
    </div>

  </div>

</section>

<section className="about-section">

  <div className="about-image">
    <img
      src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
      alt="Hotel"
    />
  </div>

  <div className="about-content">

    <p>ABOUT GRANDSTAY</p>

    <h2>
      A Place Where Comfort
      Meets Luxury
    </h2>

    <p>
      GrandStay Hotel offers a perfect combination of comfort,
      modern facilities, and exceptional hospitality.
    </p>

    <p>
      Whether you are travelling for business or leisure,
      our hotel provides everything you need for a memorable stay.
    </p>

    <button className="hero-btn">
      Discover More
    </button>

  </div>

</section>

<section className="testimonial-section">

  <div className="section-heading">
    <p>GUEST REVIEWS</p>
    <h2>What Our Guests Say</h2>
  </div>

  <div className="testimonial-grid">

    <div className="testimonial-card">
      <div>⭐⭐⭐⭐⭐</div>

      <p>
        "Amazing hotel with excellent service.
        The room was clean and very comfortable."
      </p>

      <h4>Rahul Sharma</h4>
      <span>Business Traveler</span>
    </div>


    <div className="testimonial-card">
      <div>⭐⭐⭐⭐⭐</div>

      <p>
        "The staff was extremely friendly and the
        overall experience was wonderful."
      </p>

      <h4>Priya Patil</h4>
      <span>Family Traveler</span>
    </div>


    <div className="testimonial-card">
      <div>⭐⭐⭐⭐⭐</div>

      <p>
        "Beautiful rooms, great food and excellent
        hospitality. Highly recommended."
      </p>

      <h4>Aditya Joshi</h4>
      <span>Guest</span>
    </div>

  </div>

</section>


    </div>
  );
}

export default Home;
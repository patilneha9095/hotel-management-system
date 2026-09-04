import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">GrandStay</Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/rooms">Rooms</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/rooms" className="book-btn">
          Book Now
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
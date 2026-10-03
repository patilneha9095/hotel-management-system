import { Link, Outlet, useNavigate } from "react-router-dom";

function CustomerLayout() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="customer-layout">
      <header className="customer-navbar">
        <div className="customer-logo">
          <Link to="/">
            GrandStay
          </Link>
        </div>

        <nav className="customer-nav-links">
          <Link to="/">
            Home
          </Link>

          <Link to="/rooms">
            Rooms
          </Link>

          <Link to="/customer/dashboard">
            Dashboard
          </Link>

          <Link to="/customer/reviews">
            Reviews
          </Link>

          <Link to="/customer/notifications">
            Notifications
          </Link>
        </nav>

        <div className="customer-nav-user">
          <span>
            {user?.name || "Customer"}
          </span>

          <button
            className="small-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="customer-layout-content">
        <Outlet />
      </main>
    </div>
  );
}

export default CustomerLayout;
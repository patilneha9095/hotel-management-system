import {
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

function AdminLayout() {
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
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-logo">
          <Link to="/admin/dashboard">
            GrandStay Admin
          </Link>
        </div>

        <nav className="admin-sidebar-nav">

          <Link to="/admin/dashboard">
            Dashboard
          </Link>

          <Link to="/admin/bookings">
            Bookings
          </Link>

          <Link to="/admin/guests">
            Guests
          </Link>

          <Link to="/admin/calendar">
            Calendar
          </Link>

          <Link to="/admin/payments">
            Payments
          </Link>

          <Link to="/admin/reviews">
            Reviews
          </Link>

          <Link to="/admin/reports">
            Reports
          </Link>

          <Link to="/admin/settings">
            Settings
          </Link>

        </nav>

        <button
          className="admin-logout"
          onClick={logout}
        >
          Logout
        </button>

      </aside>

      <main className="admin-main">

        <header className="admin-topbar">

          <div>
            <h3>Hotel Management</h3>
          </div>

          <div>
            {user?.name || "Administrator"}
          </div>

        </header>

        <div className="admin-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default AdminLayout;
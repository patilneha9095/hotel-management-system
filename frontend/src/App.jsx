import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";

import CustomerLayout from "./layouts/CustomerLayout";

import CustomerDashboard from "./pages/CustomerDashboard";
import BookingDetails from "./pages/BookingDetails";
import Reviews from "./pages/Reviews";
import Notifications from "./pages/Notifications";

import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import Guests from "./pages/Guests";
import Calendar from "./pages/Calendar";
import Payments from "./pages/Payments";
import Invoice from "./pages/Invoice";
import AdminReviews from "./pages/AdminReviews";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import AdminLayout from "./layouts/AdminLayout";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/rooms"
          element={<Rooms />}
        />

        <Route
          path="/rooms/:id"
          element={<RoomDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/booking"
          element={<Booking />}
        />

        {/* Customer pages */}

        <Route
          element={<CustomerLayout />}
        >
          <Route
            path="/customer/dashboard"
            element={<CustomerDashboard />}
          />

          <Route
            path="/customer/bookings/:id"
            element={<BookingDetails />}
          />

          <Route
            path="/customer/reviews"
            element={<Reviews />}
          />

          <Route
            path="/customer/notifications"
            element={<Notifications />}
          />
        </Route>

        {/* Admin */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/bookings"
          element={<AdminBookings />}
        />
        <Route element={<AdminLayout />}></Route>

        <Route
          path="/admin/guests"
          element={<Guests />}
        />

        <Route
          path="/admin/calendar"
          element={<Calendar />}
        />

        <Route
          path="/admin/payments"
          element={<Payments />}
        />

        <Route
          path="/admin/invoice/:id"
          element={<Invoice />}
        />

        <Route
          path="/admin/reviews"
          element={<AdminReviews />}
        />

        <Route
          path="/admin/reports"
          element={<Reports />}
        />

        <Route
          path="/admin/settings"
          element={<Settings />}
        />

        {/* Receptionist */}

        <Route
          path="/receptionist/dashboard"
          element={<ReceptionistDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rooms from "./pages/Rooms";
import AddRoom from "./pages/AddRoom";
import Booking from "./pages/Booking";
import RoomDetails from "./pages/RoomDetails";
import CustomerDashboard from "./pages/CustomerDashboard";
import BookingDetails from "./pages/BookingDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import Guests from "./pages/Guests";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import Calendar from "./pages/Calendar";
import Invoice from "./pages/Invoice";



function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route path="/rooms" element={<Rooms />} />

        <Route
  path="/admin/rooms/add"
  element={<AddRoom />}
/>

<Route
  path="/rooms/:id"
  element={<RoomDetails />}
/>

<Route
  path="/booking"
  element={<Booking />}
/>

<Route
  path="/customer/dashboard"
  element={<CustomerDashboard />}
/>

<Route
  path="/customer/bookings/:id"
  element={<BookingDetails />}
/>
<Route
  path="/admin/dashboard"
  element={<AdminDashboard />}
/>

<Route
  path="/admin/bookings"
  element={<AdminBookings />}
/>

<Route
  path="/admin/guests"
  element={<Guests />}
/>

<Route
  path="/receptionist/dashboard"
  element={<ReceptionistDashboard />}
/>
<Route
  path="/admin/calendar"
  element={<Calendar />}
/>

<Route
  path="/admin/invoice/:id"
  element={<Invoice />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
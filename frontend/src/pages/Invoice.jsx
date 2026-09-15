import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Invoice() {
  const { id } = useParams();

  const [booking, setBooking] =
    useState(null);

  const [payment, setPayment] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const bookingResponse =
        await axios.get(
          `http://localhost:5000/api/bookings/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setBooking(bookingResponse.data);

      try {
        const paymentResponse =
          await axios.get(
            `http://localhost:5000/api/payments/booking/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setPayment(
          paymentResponse.data
        );
      } catch (paymentError) {
        setPayment(null);
      }
    } catch (error) {
      console.error(
        "Failed to load invoice:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Loading invoice...</h1>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="admin-page">
        <h1>Booking not found</h1>
      </div>
    );
  }

  return (
    <div className="invoice-page">

      <div className="invoice-actions">
        <button
          className="small-btn"
          onClick={() => window.print()}
        >
          Print Invoice
        </button>
      </div>

      <div className="invoice-card">

        <div className="invoice-header">

          <div>
            <h1>GRANDSTAY</h1>

            <p>
              Hotel Management System
            </p>
          </div>

          <div>
            <h2>INVOICE</h2>

            <p>
              #{booking._id}
            </p>
          </div>

        </div>

        <hr />

        <div className="invoice-details">

          <div>
            <h3>Guest Details</h3>

            <p>
              <strong>Name:</strong>{" "}
              {booking.user?.name ||
                "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {booking.user?.email ||
                "N/A"}
            </p>
          </div>

          <div>
            <h3>Booking Details</h3>

            <p>
              <strong>Room:</strong>{" "}
              {booking.room?.roomNumber ||
                "N/A"}
            </p>

            <p>
              <strong>Room Type:</strong>{" "}
              {booking.room?.roomType ||
                "N/A"}
            </p>

            <p>
              <strong>Guests:</strong>{" "}
              {booking.guests}
            </p>
          </div>

        </div>

        <div className="invoice-dates">

          <div>
            <strong>Check-in</strong>

            <p>
              {new Date(
                booking.checkIn
              ).toLocaleDateString()}
            </p>
          </div>

          <div>
            <strong>Check-out</strong>

            <p>
              {new Date(
                booking.checkOut
              ).toLocaleDateString()}
            </p>
          </div>

          <div>
            <strong>Nights</strong>

            <p>
              {booking.nights}
            </p>
          </div>

        </div>

        <table className="invoice-table">

          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                {booking.room?.roomType ||
                  "Room"}{" "}
                × {booking.nights} night(s)
              </td>

              <td>
                ₹{booking.totalAmount}
              </td>
            </tr>
          </tbody>

        </table>

        <div className="invoice-total">

          <div>
            <span>Total Amount</span>
            <strong>
              ₹{booking.totalAmount}
            </strong>
          </div>

          <div>
            <span>Paid Amount</span>
            <strong>
              ₹
              {payment?.paidAmount || 0}
            </strong>
          </div>

          <div>
            <span>Remaining</span>
            <strong>
              ₹
              {payment?.remainingAmount ||
                booking.totalAmount}
            </strong>
          </div>

        </div>

        <div className="invoice-payment">

          <p>
            <strong>
              Payment Status:
            </strong>{" "}
            {payment?.paymentStatus ||
              "Pending"}
          </p>

          <p>
            <strong>
              Payment Method:
            </strong>{" "}
            {payment?.paymentMethod ||
              "N/A"}
          </p>

          <p>
            <strong>
              Transaction ID:
            </strong>{" "}
            {payment?.transactionId ||
              "N/A"}
          </p>

        </div>

        <div className="invoice-footer">

          <p>
            Thank you for staying with
            GrandStay Hotel.
          </p>

          <p>
            We hope to see you again!
          </p>

        </div>

      </div>

    </div>
  );
}

export default Invoice;
import { useEffect, useState } from "react";
import axios from "axios";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/payments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayments(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch payments:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Loading payments...</h1>
      </div>
    );
  }

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Payments</h1>
          <p>
            Manage hotel booking payments and
            payment status.
          </p>
        </div>

        <button
          className="small-btn"
          onClick={fetchPayments}
        >
          Refresh
        </button>
      </div>

      <div className="booking-table-wrapper">

        <table className="booking-table">

          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Method</th>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>

          <tbody>

            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment._id}>

                  <td>
                    {payment.user?.name ||
                      "N/A"}
                  </td>

                  <td>
                    {payment.booking?.room
                      ?.roomNumber ||
                      "N/A"}
                  </td>

                  <td>
                    ₹{payment.amount}
                  </td>

                  <td>
                    ₹{payment.paidAmount}
                  </td>

                  <td>
                    ₹{payment.remainingAmount}
                  </td>

                  <td>
                    {payment.paymentMethod}
                  </td>

                  <td>
                    {payment.paymentStatus}
                  </td>

                  <td>
                    {payment.transactionId ||
                      "N/A"}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  No payments found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Payments;
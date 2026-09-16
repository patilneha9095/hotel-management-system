import { useEffect, useState } from "react";
import axios from "axios";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/reviews",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews(response.data.reviews);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    reviewId,
    status
  ) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/reviews/${reviewId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review status updated");

      fetchReviews();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update review"
      );
    }
  };

  const deleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review deleted");

      fetchReviews();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete review"
      );
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Review Management</h1>
          <p>
            Manage customer reviews and ratings.
          </p>
        </div>
      </div>

      <div className="admin-panel">
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          <div className="booking-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id}>
                    <td>
                      <strong>
                        {review.user?.name ||
                          "N/A"}
                      </strong>

                      <br />

                      <small>
                        {review.user?.email ||
                          "N/A"}
                      </small>
                    </td>

                    <td>
                      {review.room?.roomType ||
                        "N/A"}

                      <br />

                      Room{" "}
                      {review.room?.roomNumber ||
                        "N/A"}
                    </td>

                    <td>
                      <span className="review-rating">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(
                          5 - review.rating
                        )}
                      </span>
                    </td>

                    <td>
                      {review.comment}
                    </td>

                    <td>
                      <select
                        value={review.status}
                        onChange={(e) =>
                          updateStatus(
                            review._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Approved">
                          Approved
                        </option>

                        <option value="Hidden">
                          Hidden
                        </option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="small-btn"
                        onClick={() =>
                          deleteReview(
                            review._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReviews;
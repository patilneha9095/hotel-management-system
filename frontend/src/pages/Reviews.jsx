import { useEffect, useState } from "react";
import axios from "axios";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    bookingId: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/reviews/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews(response.data.reviews);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          bookingId: form.bookingId,
          rating: Number(form.rating),
          comment: form.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review submitted successfully");

      setForm({
        bookingId: "",
        rating: 5,
        comment: "",
      });

      fetchReviews();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to submit review"
      );
    }
  };

  return (
    <div className="customer-page">
      <div className="page-header">
        <div>
          <h1>Reviews & Ratings</h1>
          <p>
            Share your experience with our hotel.
          </p>
        </div>
      </div>

      <div className="review-form-card">
        <h2>Write a Review</h2>

        <form onSubmit={submitReview}>
          <div className="form-group">
            <label>Booking ID</label>

            <input
              type="text"
              name="bookingId"
              placeholder="Enter completed booking ID"
              value={form.bookingId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Rating</label>

            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
            >
              <option value="5">★★★★★ - 5</option>
              <option value="4">★★★★☆ - 4</option>
              <option value="3">★★★☆☆ - 3</option>
              <option value="2">★★☆☆☆ - 2</option>
              <option value="1">★☆☆☆☆ - 1</option>
            </select>
          </div>

          <div className="form-group">
            <label>Your Review</label>

            <textarea
              name="comment"
              placeholder="Write your experience..."
              value={form.comment}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <button type="submit" className="book-btn">
            Submit Review
          </button>
        </form>
      </div>

      <div className="my-reviews">
        <h2>My Reviews</h2>

        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews submitted yet.</p>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div
                className="review-card"
                key={review._id}
              >
                <div className="review-header">
                  <div>
                    <h3>
                      {review.room?.roomType ||
                        "Room"}
                    </h3>

                    <p>
                      Room{" "}
                      {review.room?.roomNumber ||
                        "N/A"}
                    </p>
                  </div>

                  <span className="review-rating">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>

                <p className="review-comment">
                  {review.comment}
                </p>

                <p>
                  Status: {review.status}
                </p>

                <small>
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;
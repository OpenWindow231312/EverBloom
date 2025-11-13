// ========================================
// 🌸 EverBloom — Dashboard Reviews Management
// ========================================
import React, { useState, useEffect } from "react";
import { Star, Send, X } from "lucide-react";
import "./Dashboard.css";

export default function DashboardReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const API_URL =
    import.meta.env?.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5001";

  const defaultEmailTemplate = `Dear [Customer Name],

We are so sorry to hear about your recent experience with our flowers. Your feedback is incredibly valuable to us, and we take it very seriously.

Would you be willing to share a few more details about what happened? We'd love the opportunity to make this right and improve your experience with us.

Please feel free to reply to this email with any additional information.

Thank you for taking the time to share your thoughts.

Warm regards,
EverBloom Team`;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < rating ? "#FCB207" : "none"}
        stroke={index < rating ? "#FCB207" : "#ccc"}
      />
    ));
  };

  const handleFollowUp = (review) => {
    setSelectedReview(review);
    // Pre-populate with customer name
    const personalizedMessage = defaultEmailTemplate.replace(
      "[Customer Name]",
      review.User?.fullName || "Valued Customer"
    );
    setEmailMessage(personalizedMessage);
    setShowEmailModal(true);
  };

  const handleSendEmail = async () => {
    if (!emailMessage.trim()) {
      alert("Please enter a message");
      return;
    }

    setSendingEmail(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/reviews/${selectedReview.review_id}/follow-up`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: emailMessage }),
        }
      );

      if (res.ok) {
        alert("✅ Follow-up email sent successfully!");
        setShowEmailModal(false);
        setSelectedReview(null);
        setEmailMessage("");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to send email");
      }
    } catch (err) {
      console.error("Error sending email:", err);
      alert("Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="dashboard-section">
        <h1>Reviews Management</h1>
        <p className="loading-text">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <h1>Reviews Management</h1>
      <p className="section-subtitle">
        Monitor customer reviews and follow up on feedback
      </p>

      <div className="reviews-stats">
        <div className="stat-card">
          <h3>Total Reviews</h3>
          <p className="stat-number">{reviews.length}</p>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p className="stat-number">
            {reviews.length > 0
              ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                ).toFixed(1)
              : "0.0"}
          </p>
        </div>
        <div className="stat-card">
          <h3>Low Ratings</h3>
          <p className="stat-number">
            {reviews.filter((r) => r.rating <= 2).length}
          </p>
        </div>
      </div>

      <div className="reviews-table-container">
        {reviews.length === 0 ? (
          <p className="no-data-message">No reviews yet.</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Flower</th>
                <th>Rating</th>
                <th>Heading</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review.review_id}
                  className={review.rating <= 2 ? "low-rating-row" : ""}
                >
                  <td>{formatDate(review.createdAt)}</td>
                  <td>
                    <div className="customer-cell">
                      <strong>{review.User?.fullName || "N/A"}</strong>
                      <small>{review.User?.email || ""}</small>
                    </div>
                  </td>
                  <td>
                    <div className="flower-cell">
                      {review.Flower?.image_url && (
                        <img
                          src={review.Flower.image_url}
                          alt={review.Flower.variety}
                          className="flower-thumb"
                        />
                      )}
                      <span>{review.Flower?.variety || "N/A"}</span>
                    </div>
                  </td>
                  <td>
                    <div className="rating-cell">{renderStars(review.rating)}</div>
                  </td>
                  <td>{review.heading || "-"}</td>
                  <td>
                    <div className="comment-cell">
                      {review.comment
                        ? review.comment.length > 60
                          ? review.comment.substring(0, 60) + "..."
                          : review.comment
                        : "-"}
                    </div>
                  </td>
                  <td>
                    {review.rating <= 2 && (
                      <button
                        className="btn-follow-up"
                        onClick={() => handleFollowUp(review)}
                      >
                        <Send size={16} /> Follow Up
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && selectedReview && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div
            className="modal-content email-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Follow Up on Review</h2>
              <button
                className="close-modal-btn"
                onClick={() => setShowEmailModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="review-summary">
              <div className="review-summary-item">
                <strong>Customer:</strong> {selectedReview.User?.fullName}
              </div>
              <div className="review-summary-item">
                <strong>Email:</strong> {selectedReview.User?.email}
              </div>
              <div className="review-summary-item">
                <strong>Flower:</strong> {selectedReview.Flower?.variety}
              </div>
              <div className="review-summary-item">
                <strong>Rating:</strong>{" "}
                <div className="inline-stars">
                  {renderStars(selectedReview.rating)}
                </div>
              </div>
              {selectedReview.comment && (
                <div className="review-summary-item full-width">
                  <strong>Comment:</strong>
                  <p className="review-comment-text">{selectedReview.comment}</p>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email-message">Email Message</label>
              <textarea
                id="email-message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={12}
                className="email-textarea"
              />
              <small className="form-hint">
                Note: This is a mock email. It will not actually be sent.
              </small>
            </div>

            <div className="modal-actions">
              <button
                className="btn-send-email"
                onClick={handleSendEmail}
                disabled={sendingEmail || !emailMessage.trim()}
              >
                {sendingEmail ? "Sending..." : "Send Email"}
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowEmailModal(false)}
                disabled={sendingEmail}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

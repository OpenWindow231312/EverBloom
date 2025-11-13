// ========================================
// 🌸 EverBloom — Review Card Component
// ========================================
import React from "react";
import { Star, Trash2, Edit2 } from "lucide-react";
import "./ReviewCard.css";

function ReviewCard({ review, onEdit, onDelete, showActions = false, API_URL }) {
  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`star-icon ${index < rating ? "filled" : ""}`}
        size={18}
        fill={index < rating ? "#FCB207" : "none"}
        stroke={index < rating ? "#FCB207" : "#ccc"}
      />
    ));
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.User?.profilePhoto ? (
              <img
                src={`${API_URL}${review.User.profilePhoto}`}
                alt={review.User?.fullName}
              />
            ) : (
              <div className="avatar-placeholder">
                {review.User?.fullName?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="reviewer-details">
            <h4 className="reviewer-name">{review.User?.fullName || "Anonymous"}</h4>
            <div className="review-rating">{renderStars(review.rating)}</div>
          </div>
        </div>
        <div className="review-date">{formatDate(review.createdAt)}</div>
      </div>

      {review.heading && (
        <h3 className="review-heading">{review.heading}</h3>
      )}

      {review.comment && (
        <p className="review-comment">{review.comment}</p>
      )}

      {review.image_url && (
        <div className="review-image-container">
          <img
            src={`${API_URL}${review.image_url}`}
            alt="Review"
            className="review-image"
          />
        </div>
      )}

      {showActions && (
        <div className="review-actions">
          <button className="btn-edit" onClick={() => onEdit(review)}>
            <Edit2 size={16} /> Edit
          </button>
          <button className="btn-delete" onClick={() => onDelete(review.review_id)}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewCard;

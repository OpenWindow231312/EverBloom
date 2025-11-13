// ========================================
// 🌸 EverBloom — Add Review Form Component
// ========================================
import React, { useState } from "react";
import { Star, Upload, X } from "lucide-react";
import "./AddReviewForm.css";

function AddReviewForm({ flowerId, onSubmit, onCancel, initialData = null, API_URL }) {
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [heading, setHeading] = useState(initialData?.heading || "");
  const [comment, setComment] = useState(initialData?.comment || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image_url ? `${API_URL}${initialData.image_url}` : null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        rating,
        heading,
        comment,
        image
      });
      
      // Reset form if not editing
      if (!initialData) {
        setRating(5);
        setHeading("");
        setComment("");
        setImage(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <Star
          key={index}
          className={`star-input ${starValue <= (hoveredRating || rating) ? "active" : ""}`}
          size={32}
          fill={starValue <= (hoveredRating || rating) ? "#FCB207" : "none"}
          stroke={starValue <= (hoveredRating || rating) ? "#FCB207" : "#ccc"}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
        />
      );
    });
  };

  return (
    <div className="add-review-form">
      <h3 className="form-title">
        {initialData ? "Edit Your Review" : "Write a Review"}
      </h3>
      
      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="form-group">
          <label>Your Rating *</label>
          <div className="star-rating-input">
            {renderStars()}
          </div>
        </div>

        {/* Heading */}
        <div className="form-group">
          <label htmlFor="heading">Review Heading</label>
          <input
            type="text"
            id="heading"
            placeholder="e.g., Beautiful and Fresh!"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            maxLength={255}
          />
        </div>

        {/* Comment */}
        <div className="form-group">
          <label htmlFor="comment">Your Review *</label>
          <textarea
            id="comment"
            placeholder="Share your experience with this flower..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            required
          />
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label>Add Photo (Optional)</label>
          <div className="image-upload-container">
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={removeImage}
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="upload-label">
                <Upload size={24} />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
          <small className="upload-hint">Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP</small>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting || !comment}
          >
            {isSubmitting ? "Submitting..." : initialData ? "Update Review" : "Submit Review"}
          </button>
          {onCancel && (
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddReviewForm;

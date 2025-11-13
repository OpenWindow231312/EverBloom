// ========================================
// 🌸 EverBloom — Individual Product Page (with Dynamic SEO & Reviews)
// ========================================
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";
import API from "../api/api";
import { Heart, ShoppingBag, Star } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ReviewCard from "../components/ReviewCard";
import AddReviewForm from "../components/AddReviewForm";
import { Helmet } from "react-helmet-async";

function ProductPage() {
  const { id } = useParams(); // URL param (flower_id)

  const [flower, setFlower] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favourites")) || []
  );
  const [loading, setLoading] = useState(true);
  
  // Review states
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const API_URL =
    import.meta.env?.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5001";

  // 🌼 Fetch flower by ID
  useEffect(() => {
    const fetchFlower = async () => {
      try {
        const res = await API.get(`/shop/${id}`);
        setFlower(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlower();
  }, [id]);

  // 📖 Fetch reviews for this flower
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get(`/reviews/flower/${id}`);
        setReviews(res.data.reviews || []);
        setAverageRating(parseFloat(res.data.averageRating) || 0);
        setTotalReviews(res.data.totalReviews || 0);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  // ❤️ Toggle favourite
  const toggleFavourite = () => {
    let updated;
    const exists = favourites.find((f) => f.flower_id === flower.flower_id);
    if (exists) {
      updated = favourites.filter((f) => f.flower_id !== flower.flower_id);
    } else {
      updated = [...favourites, flower];
    }
    setFavourites(updated);
    localStorage.setItem("favourites", JSON.stringify(updated));
  };

  // 🛒 Add to cart
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.flower_id === flower.flower_id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item.flower_id === flower.flower_id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cart, { ...flower, quantity }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("🛒 Added to cart!");
  };

  // ✍️ Submit new review
  const handleSubmitReview = async (reviewData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to leave a review");
        return;
      }

      const formData = new FormData();
      formData.append("flower_id", id);
      formData.append("rating", reviewData.rating);
      formData.append("heading", reviewData.heading);
      formData.append("comment", reviewData.comment);
      if (reviewData.image) {
        formData.append("reviewImage", reviewData.image);
      }

      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setTotalReviews(totalReviews + 1);
        
        // Recalculate average
        const newAvg = (averageRating * totalReviews + reviewData.rating) / (totalReviews + 1);
        setAverageRating(newAvg);
        
        setShowReviewForm(false);
        alert("✅ Review submitted successfully!");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review");
    }
  };

  // Render stars for average rating
  const renderAverageStars = () => {
    return [...Array(5)].map((_, index) => {
      const filled = index < Math.round(averageRating);
      return (
        <Star
          key={index}
          size={20}
          fill={filled ? "#FCB207" : "none"}
          stroke={filled ? "#FCB207" : "#ccc"}
          className="avg-star"
        />
      );
    });
  };

  if (loading) return <p className="loading-text">Loading flower details...</p>;
  if (!flower) return <p className="error-text">Flower not found.</p>;

  // ✅ Safe conversions
  const isFavourite = favourites.some((f) => f.flower_id === flower.flower_id);
  const onSale = Number(flower.is_on_sale) === 1;

  const price = Number(flower.price_per_stem || 0).toFixed(2);
  const salePrice = Number(
    flower.sale_price_per_stem || flower.price_per_stem || 0
  ).toFixed(2);
  const stemLength = flower.stem_length ? `${flower.stem_length} cm` : "N/A";
  const shelfLife = flower.shelf_life ? `${flower.shelf_life} days` : "N/A";
  const harvestDate = flower.harvest_date
    ? new Date(flower.harvest_date).toLocaleDateString("en-ZA")
    : "N/A";

  // 🪷 Dynamic SEO values
  const title = `${flower.variety} | EverBloom`;
  const description =
    flower.description ||
    `Buy ${flower.variety} from EverBloom — sustainably grown, freshly harvested flowers from our South African farm.`;
  const imageUrl =
    flower.image_url && flower.image_url.trim() !== ""
      ? flower.image_url
      : "https://everbloomshop.co.za/default-flower.jpg";
  const canonicalUrl = `https://everbloomshop.co.za/product/${flower.flower_id}`;

  return (
    <>
      {/* 🪷 Dynamic SEO Meta Tags */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content={`EverBloom, ${flower.variety}, ${
            flower.FlowerType?.flowerTypeName || "flowers"
          }, florist, bouquets, South Africa`}
        />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Social */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="EverBloom" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>

      <div>
        <NavBar />

        <div className="product-page">
          <div className="product-container">
            {/* 🖼️ Image Section */}
            <div className="product-image-container">
              <img
                src={
                  flower.image_url && flower.image_url.trim() !== ""
                    ? flower.image_url
                    : require("../assets/placeholder-flower.jpg")
                }
                alt={`${flower.variety} flower`}
                className="product-image"
              />
              <button
                className={`favourite-btn ${isFavourite ? "active" : ""}`}
                onClick={toggleFavourite}
              >
                <Heart className="heart-icon" />
              </button>
              {onSale && <div className="sale-badge">On Sale</div>}
            </div>

            {/* 🌸 Details Section */}
            <div className="product-details">
              <h1 className="product-title">{flower.variety}</h1>
              <p className="product-type">
                {flower.FlowerType?.flowerTypeName || "Flower"}
              </p>

              <div className="price-section">
                {onSale ? (
                  <>
                    <h2 className="product-price">R {salePrice}</h2>
                    <span className="old-price">R {price}</span>
                    <span className="sale-text">Limited time discount!</span>
                  </>
                ) : (
                  <h2 className="product-price">R {price}</h2>
                )}
              </div>

              <p className="product-description">
                {flower.description || "No description available."}
              </p>

              <div className="product-info1">
                <p>
                  <strong>Stem Length:</strong> {stemLength}
                </p>
                <p>
                  <strong>Shelf Life:</strong> {shelfLife}
                </p>
                <p>
                  <strong>Harvest Date:</strong> {harvestDate}
                </p>
                <p
                  className={`stock-text ${
                    flower.stock_available <= 5 ? "low-stock" : ""
                  }`}
                >
                  <strong>In Stock:</strong>{" "}
                  {flower.stock_available > 0
                    ? `${flower.stock_available} stems`
                    : "Out of stock"}
                </p>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="cart-actions">
                <div className="quantity-selector">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>

                <button
                  className="add-to-cart-btn"
                  onClick={addToCart}
                  disabled={flower.stock_available <= 0}
                  style={{
                    background: flower.stock_available <= 0 ? "#ccc" : "",
                    cursor:
                      flower.stock_available <= 0 ? "not-allowed" : "pointer",
                  }}
                >
                  <ShoppingBag className="cart-icon" />
                  {flower.stock_available <= 0 ? "Sold Out" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>

          {/* 🌟 Reviews Section */}
          <div className="reviews-section">
            <div className="reviews-header">
              <div className="reviews-summary">
                <h2 className="reviews-title">Customer Reviews</h2>
                {totalReviews > 0 ? (
                  <div className="average-rating-display">
                    <div className="rating-score">{averageRating.toFixed(1)}</div>
                    <div className="rating-details">
                      <div className="stars-display">{renderAverageStars()}</div>
                      <p className="total-reviews">Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="no-reviews-prompt">
                    <p className="no-reviews-text">🌸 Be the first to leave a review!</p>
                  </div>
                )}
              </div>
              
              {!showReviewForm && (
                <button
                  className="btn-write-review"
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      alert("Please log in to leave a review");
                      return;
                    }
                    setShowReviewForm(true);
                  }}
                >
                  Write a Review
                </button>
              )}
            </div>

            {showReviewForm && (
              <AddReviewForm
                flowerId={id}
                onSubmit={handleSubmitReview}
                onCancel={() => setShowReviewForm(false)}
                API_URL={API_URL}
              />
            )}

            {reviewsLoading ? (
              <p className="loading-text">Loading reviews...</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.review_id}
                    review={review}
                    showActions={false}
                    API_URL={API_URL}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default ProductPage;

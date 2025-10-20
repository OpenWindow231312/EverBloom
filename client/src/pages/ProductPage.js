import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import API from "../api/api";
import "../styles/shop/ProductPage.css";

function ProductPage() {
  const { id } = useParams();
  const [flower, setFlower] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/shop/${id}`)
      .then((res) => setFlower(res.data))
      .catch((err) => console.error("Error fetching product:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="product-loading">
          <p>Loading flower details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!flower) {
    return (
      <div>
        <NavBar />
        <div className="product-error">
          <p>Flower not found.</p>
          <Link to="/shop" className="back-link">
            ← Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <NavBar />

      <section className="product-page">
        <div className="product-container">
          <img
            src={flower.image_url}
            alt={flower.name}
            className="product-img"
          />

          <div className="product-info">
            <h1 className="product-name">{flower.name}</h1>
            <p className="product-type">{flower.FlowerType?.name}</p>
            <p className="product-price">R{flower.price_per_stem}</p>

            <p className="product-description">{flower.description}</p>

            <button className="btn-add">Add to Cart</button>

            <Link to="/shop" className="back-link">
              ← Back to Shop
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProductPage;

import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar"; // Importing the NavBar component
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar /> {/* Adding the NavBar component at the top */}
      <div className="hero-banner">
        <img
          src={require("../assets/HeroImageNew.jpeg")}
          alt="Hero Banner"
          className="hero-image"
        />
        <div className="hero-content">
          <h1 className="hero-heading">Beautiful Blooms</h1>
          <h2 className="hero-subheading">Delivered Fresh</h2>
          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={() => navigate("/Shop")}
            >
              Shop Collection
            </button>
            <button
              className="secondary-button"
              onClick={() => navigate("/Rewards")}
            >
              Florist Rewards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

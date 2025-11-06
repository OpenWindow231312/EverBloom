// ========================================
// 🌸 EverBloom — About Page (with SEO + Animations)
// ========================================

import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "./About.css";
import { Helmet } from "react-helmet-async";

function AboutPage() {
  // 👇 Timeline animation effect
  useEffect(() => {
    const items = document.querySelectorAll(".timeline-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* 🪷 SEO Meta Tags */}
      <Helmet>
        <title>EverBloom | About Us & Our Story</title>
        <meta
          name="description"
          content="Discover the story behind EverBloom — South Africa’s sustainable flower farm. Learn how our passion for blooms grew from a garden dream to a nationwide movement of joy and connection."
        />
        <meta
          name="keywords"
          content="EverBloom, about EverBloom, sustainable flowers, South Africa, florist, flower farm, eco-friendly blooms"
        />
        <link rel="canonical" href="https://everbloomshop.co.za/about" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="EverBloom | Our Story" />
        <meta
          property="og:description"
          content="From our humble beginnings to delivering joy nationwide — discover the EverBloom journey and our mission to grow sustainably."
        />
        <meta
          property="og:image"
          content="https://everbloomshop.co.za/og-image.jpg"
        />
        <meta property="og:url" content="https://everbloomshop.co.za/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="EverBloom" />

        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EverBloom | About Us & Our Story" />
        <meta
          name="twitter:description"
          content="Discover how EverBloom grew from a garden dream to South Africa’s sustainable flower movement — spreading beauty and connection nationwide."
        />
        <meta
          name="twitter:image"
          content="https://everbloomshop.co.za/og-image.jpg"
        />
      </Helmet>

      <div>
        <NavBar />

        {/* Hero Section */}
        <section className="about-hero">
          <img
            src={require("../assets/AboutHero.jpeg")}
            alt="About EverBloom"
            className="about-hero-image"
          />
          <div className="about-hero-overlay">
            <h1 className="about-hero-heading">Our Story</h1>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline">
          <h2 className="section-title2">The EverBloom Journey</h2>
          <div className="timeline-container">
            <div className="timeline-item left">
              <div className="timeline-content">
                <h4>2019</h4>
                <p>
                  EverBloom was born in our tiny home garden with just one
                  packet of seeds & many hours spent in the garden.
                </p>
              </div>
            </div>
            <div className="timeline-item right">
              <div className="timeline-content">
                <h4>2021</h4>
                <p>
                  We opened our first micro farm and partnered with other local
                  farmers to grow sustainably.
                </p>
              </div>
            </div>
            <div className="timeline-item left">
              <div className="timeline-content">
                <h4>2023</h4>
                <p>
                  We expanded to weddings and large-scale events, crafting
                  floral stories for every celebration.
                </p>
              </div>
            </div>
            <div className="timeline-item right">
              <div className="timeline-content">
                <h4>2025</h4>
                <p>
                  Today, EverBloom delivers thousands of flowers across the
                  country — spreading joy daily.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="about-team">
          <h2 className="section-title2">Meet the Founders</h2>
          <div className="team-cards two-columns">
            <div className="team-card">
              <img
                src={require("../assets/Mila.jpg")}
                alt="Mila Green"
                className="team-image"
              />
              <h3 className="team-name">Mila Green</h3>
              <p className="team-role">Co-Founder & Head Florist</p>
            </div>
            <div className="team-card">
              <img
                src={require("../assets/Andrew.jpg")}
                alt="Andrew Green"
                className="team-image"
              />
              <h3 className="team-name">Andrew Green</h3>
              <p className="team-role">Co-Founder & Operations Lead</p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-mission-split">
          <div className="about-mission-container">
            <div className="mission-image">
              <img
                src={require("../assets/Mission.jpeg")}
                alt="EverBloom Mission"
              />
            </div>
            <div className="mission-text">
              <h2 className="section-title">Our Mission</h2>
              <p className="section-text">
                At EverBloom, our mission is simple: to spread joy and
                connection through sustainable, premium-quality blooms. Every
                bouquet tells a story, every arrangement carries a piece of our
                heart. We believe flowers are more than décor — they are vessels
                of memory, love, and meaning. We ensure ethical practices,
                support our community, and deliver freshness straight from farm
                to doorstep. Whether it’s a spontaneous gift, a wedding, or a
                milestone celebration, EverBloom is here to help you honor
                life’s most cherished moments with beauty that lasts.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-values">
          <h2 className="section-title2">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon-circle">
                <img
                  src={require("../assets/icons8-community-50.png")}
                  alt="Community"
                  className="value-icon"
                />
              </div>
              <h3 className="value-title">Community</h3>
              <p>
                We grow together with local farmers, artisans, and our
                customers.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon-circle">
                <img
                  src={require("../assets/icons8-leaf-50.png")}
                  alt="Sustainability"
                  className="value-icon"
                />
              </div>
              <h3 className="value-title">Sustainability</h3>
              <p>
                Eco-friendly practices that protect our planet and future
                generations.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon-circle">
                <img
                  src={require("../assets/icons8-flower-50.png")}
                  alt="Craftsmanship"
                  className="value-icon"
                />
              </div>
              <h3 className="value-title">Craftsmanship</h3>
              <p>
                Every bouquet is designed with artistry, care, and precision.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon-circle">
                <img
                  src={require("../assets/icons8-sparkle-50.png")}
                  alt="Joy"
                  className="value-icon"
                />
              </div>
              <h3 className="value-title">Joy</h3>
              <p>
                Flowers that celebrate love, happiness, and the beauty of life
                itself.
              </p>
            </div>
          </div>
        </section>

        {/* Customers Section */}
        <section className="testimonials">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonial-carousel">
            <div className="testimonial-track">
              <div className="testimonial-card">
                <p className="testimonial-text">
                  “EverBloom made my wedding day unforgettable. The flowers were
                  breathtaking and so fresh!”
                </p>
                <h4 className="testimonial-name">– Sarah J.</h4>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-text">
                  “I ordered a same-day bouquet for my mom, and it arrived in
                  hours. She was in tears of joy!”
                </p>
                <h4 className="testimonial-name">– Michael R.</h4>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-text">
                  “Their attention to detail is unmatched. You can feel the love
                  in every arrangement.”
                </p>
                <h4 className="testimonial-name">– Aisha K.</h4>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-text">
                  “Best florist in town! EverBloom’s team made our anniversary
                  magical.”
                </p>
                <h4 className="testimonial-name">– David & Laura</h4>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-text">
                  “The freshness and quality blew me away. I’ll never order from
                  anyone else.”
                </p>
                <h4 className="testimonial-name">– Priya S.</h4>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-text">
                  “EverBloom’s arrangements always brighten my home. Beautiful
                  every time.”
                </p>
                <h4 className="testimonial-name">– Johan V.</h4>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default AboutPage;

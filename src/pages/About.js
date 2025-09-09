import React, { useEffect } from "react";
import "./About.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (

        <div className="min-h-screen bg-[#ffffff]">
        <Navbar />
    <div className="about-page">
      
      <div className="about-content">
        <h1 className="about-main-title">About Islamic Sphere</h1>
        <h2 className="about-subtitle">Connecting Faith and Community</h2>
        
        <div className="about-card">
          <p className="about-text">
            Islamic Sphere is a digital platform committed to fostering group-based Islamic learning and emotional well-being through the guidance of the Quran and Hadith. Unlike traditional Islamic apps that emphasize personal learning, we focus on building a shared spiritual journey.
          </p>
          
          <div className="about-features">
            <div className="feature-item">
              <span className="featuress-icon">📚</span>
              <h3>Structured Learning</h3>
              <p>Comprehensive Islamic education paths</p>
            </div>
            
            <div className="feature-item">
              <span className="featuress-icon">🤝</span>
              <h3>Community Focus</h3>
              <p>Connect with like-minded believers</p>
            </div>
            
            <div className="feature-item">
              <span className="featuress-icon">🕌</span>
              <h3>Authentic Knowledge</h3>
              <p>Based on Quran and authentic Hadith</p>
            </div>
          </div>
          
          <p className="about-closing">
            Our platform is designed to deepen faith, encourage accountability, and nurture meaningful community connections in a modern, accessible way.
          </p>
        </div>
      </div>
    </div>
      <Footer />
    </div>
  );
};

export default About; 
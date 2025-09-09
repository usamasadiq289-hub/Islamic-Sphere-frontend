import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import {
  FaBrain,
  FaCalendarAlt,
  FaUserFriends,
  FaQuestionCircle,
  FaHeartbeat,
  FaRobot
} from "react-icons/fa";

import myimage from "../images/emoji.webp";

import Navbar from "../components/Navbar"; // Import the Navbar component
import "./Home.css"; // Optional, if you have custom styles
import Footer from "../components/Footer";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <div className="home">
        <Navbar /> {/* Add the Navbar here */}

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Islamic Sphere</h1>
            <p>Your Digital Space for Islamic Community & Growth</p>
            {!isAuthenticated && (
              <Link to="/signup" className="cta-button">Join Our Community</Link>
            )}
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-titling">Our Features</h2>
            <p className="section-subtitle">
              Discover comprehensive Islamic tools and services designed to strengthen your faith and connect you with the community
            </p>
            <div className="features-grid">
              <div
                className="feature-card"
                style={{ '--feature-index': 0 }}
                onClick={() => navigate('/aura-scanner')}
              >
                <div className="feature-icon">
                  <FaHeartbeat />
                </div>
                <h3>EmoVerse</h3>
                <p>Track your emotional and spiritual well-being with our innovative emotional verses </p>
              </div>

              <div
                className="feature-card"
                style={{ '--feature-index': 1 }}
                onClick={() => navigate('/learning-path')}
              >
                <div className="feature-icon">
                  <FaBrain />
                </div>
                <h3>Faith Route</h3>
                <p>Follow a customized Islamic learning journey tailored to your knowledge and interests</p>
              </div>

              <div
                className="feature-card"
                style={{ '--feature-index': 2 }}
                onClick={() => navigate('/groups')}
              >
                <div className="feature-icon">
                  <FaUserFriends />
                </div>
                <h3>Faith Circles</h3>
                <p>Connect with like-minded individuals in study circles and discussion groups</p>
              </div>

              <div
                className="feature-card"
                style={{ '--feature-index': 3 }}
                onClick={() => navigate('/events')}
              >
                <div className="feature-icon">
                  <FaCalendarAlt />
                </div>
                <h3>Event Calendar</h3>
                <p>Stay updated with community events, prayer times, and Islamic occasions</p>
              </div>

              <div
                className="feature-card"
                style={{ '--feature-index': 4 }}
                onClick={() => navigate('/qna')}
              >
                <div className="feature-icon">
                  <FaQuestionCircle />
                </div>
                <h3>Q&A with Scholars</h3>
                <p>Get authentic answers to your questions from qualified Islamic scholars</p>
              </div>

              <div
                className="feature-card"
                style={{ '--feature-index': 5 }}
                onClick={() => navigate('/chat')}
              >
                <div className="feature-icon">
                  <FaRobot />
                </div>
                <h3>Islamic Chatbot</h3>
                <p>Get instant answers to your Islamic queries through our AI-powered chatbot</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}



        {/* {isAuthenticated && (
          <section className="cta-section">
            <div className="container">
              <h2>Welcome Back!</h2>
              <p>Thank you for being a valued member of our community. Explore more features and connect with others!</p>
              <div className="cta-buttons">
                <button onClick={() => navigate('/groups')} className="primary-button">My Groups</button>
                <button onClick={() => navigate('/profile')} className="secondary-button">My Profile</button>
              </div>
            </div>
          </section>
        )} */}
      </div>
      <Footer />
    </div>
  );
};

export default Home;

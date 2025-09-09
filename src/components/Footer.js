import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobe, FaYoutube, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Left: Brand */}
        <div className="footer-brand-section">
          <div className="footer-brand">
            <span className="logos-text">☪ Islamic Sphere</span>
          </div>
          <p className="footer-description">Illuminating your spiritual journey</p>
        </div>
        
        {/* Center: Social Icons */}
        <div className="footer-social">
          <h4 className="social-title">Follow Us</h4>
          <div className="social-icons">
            <a href="https://youtube.com/@islamicsphere-v2l?si=vrxQRntcmxMWvTb0" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="https://www.facebook.com/share/19ghWF2Tbz/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/islamicsphereorg?utm_source=qr&igsh=aWx5MnFqOTMzbGl2" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.tiktok.com/@islamic.sphere?_t=ZS-8zT80aObvxF&_r=1" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok">
              <FaTiktok />
            </a>
          </div>
        </div>
        
        {/* Right: Navigation Links */}
        <div className="footer-links-container">
          <nav className="footer-nav">
            <Link to="/about" className="footer-link">About</Link>
            <Link to="/learn-more" className="footer-link">Learn More</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </nav>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Islamic Sphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
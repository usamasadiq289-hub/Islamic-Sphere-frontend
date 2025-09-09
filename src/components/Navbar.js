import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from "react-toastify";
import { FaUserCircle, FaHome, FaQuestionCircle, FaUsers, FaCalendarAlt, FaMagic, FaHeart, FaMeh, FaHandPeace, FaSmile, FaComments } from 'react-icons/fa';
import "react-toastify/dist/ReactToastify.css";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set animation delay for navbar items
  useEffect(() => {
    if (navRef.current) {
      const navItems = navRef.current.querySelectorAll('.nav-item, .login-btn, .register-btn, .profile-link, .signout-btn');
      navItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
      });
    }
  }, []);

  // Removed dark mode toggle

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out!");
      setTimeout(() => {
        navigate("/"); // Add a small delay for toast to show
      }, 1000); // Increased delay to ensure toast is visible
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);

    // Toggle active class on nav-toggle for animation
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
      navToggle.classList.toggle('active');
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <>
      <nav className={`main-navbar ${isScrolled ? 'scrolled' : ''}`} ref={navRef}>
        <div className="nav-container ">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">☪</span>
            <span className="logo-text">Islamic Sphere</span>
          </Link>

          <div className={`nav-toggle ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <div className="nav-links">
              <Link
                to="/aura-scanner"
                className={`nav-item ${isActive('/aura-scanner')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaMeh className="nav-icon" />
                <span>EmoVerse</span>
              </Link>
              <Link
                to='/learning-path'
                className={`nav-item ${isActive('/learning-path')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaHome className="nav-icon" />
                <span>Faith Route</span>
              </Link>
              <Link
                to="/groups"
                className={`nav-item ${isActive('/groups')}`}
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    toast.error("Please sign in first to access this feature.");
                    setTimeout(() => {
                      navigate("/login");
                    }, 2000);
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                <FaUsers className="nav-icon" />
                <span>Faith Circles</span>
              </Link>
              <Link
                to="/events"
                className={`nav-item ${isActive('/events')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaCalendarAlt className="nav-icon" />
                <span>Events</span>
              </Link>
              <Link
                to="/qna"
                className={`nav-item ${isActive('/qna')}`}
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    toast.error("Please sign in first to access this feature.");
                    setTimeout(() => {
                      navigate("/login");
                    }, 2000);
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                <FaQuestionCircle className="nav-icon" />
                <span>Q&A</span>
              </Link>
              <Link
                to="/chat"
                className={`nav-item ${isActive('/chat')}`}
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    toast.error("Please sign in first to access this feature.");
                    setTimeout(() => {
                      navigate("/login");
                    }, 2000);
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                <FaComments className="nav-icon" />
                <span>Chat</span>
              </Link>
            </div>

            <div className="nav-auth">

              {user ? (
                <div className="user-menu">
                  <Link to="/profile" className="profile-link">
                    {user.image ? (
                      <img 
                        src={user.image} 
                        alt="Profile" 
                        className="navbar-profile-image"
                      />
                    ) : (
                      <FaUserCircle className="profile-icon" />
                    )}
                    <span className="username">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="signout-btn"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link
                    to="/login"
                    className="login-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="register-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Navbar;

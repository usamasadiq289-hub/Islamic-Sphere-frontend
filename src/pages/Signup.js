import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";

// Update the password strength checker to require letters and numbers
const checkPasswordStrength = (password) => {
  let score = 0;
  
  // Basic requirements
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  
  // Enforce minimum length of 8 characters
  if (password.length < 8) {
    return { strength: 'weak', color: '#ff4d4d', message: 'Password must be at least 8 characters' };
  }
  
  // Password must have both letters and numbers
  if (!hasLetters || !hasNumbers) {
    return { strength: 'weak', color: '#ff4d4d', message: 'Password must contain both letters and numbers' };
  }
  
  // Add point for minimum length
  score += 1;
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1; // Has uppercase
  if (/[a-z]/.test(password)) score += 1; // Has lowercase
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
  
  if (score < 2) return { strength: 'weak', color: '#ff4d4d' };
  if (score < 3) return { strength: 'medium', color: '#ffd700' };
  return { strength: 'strong', color: '#00b300' };
};

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    // phone: "" // Commented out phone field
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ strength: '', color: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Check password strength when password field changes
    if (e.target.name === 'password') {
      setPasswordStrength(checkPasswordStrength(e.target.value));
    }
  };

  // Update the handleSubmit function with new validations
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dismiss any existing toasts to prevent conflicts
    toast.dismiss();

    // Required fields validation
    if (!formData.username || !formData.email || !formData.password || 
        !formData.confirmPassword || !formData.firstName || !formData.lastName) {
      toast.error("All fields are required", { toastId: 'required-fields' });
      return;
    }

    // Name validation - only alphabetic characters and spaces/hyphens allowed
    const nameRegex = /^[A-Za-z\s-]+$/;
    if (!nameRegex.test(formData.firstName)) {
      toast.error("First name must contain only letters, spaces, or hyphens", { toastId: 'first-name-invalid' });
      return;
    }
    if (!nameRegex.test(formData.lastName)) {
      toast.error("Last name must contain only letters, spaces, or hyphens", { toastId: 'last-name-invalid' });
      return;
    }

    // Username validation - check for email patterns first
    const emailPattern = /@(gmail|yahoo|hotmail|outlook|aol|icloud|protonmail|zoho|yandex|mail)\./i;
    if (emailPattern.test(formData.username) || formData.username.includes('@') || formData.username.includes('.')) {
      toast.error("Username cannot contain email addresses or email-like patterns", { toastId: 'username-email-pattern' });
      return;
    }
    
    // Then check username format
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;
    const hasNumber = /[0-9]/.test(formData.username);
    
    if (!usernameRegex.test(formData.username) || !hasNumber) {
      toast.error("Username must start with a letter and include number", { toastId: 'username-format' });
      return;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email", { toastId: 'email-invalid' });
      return;
    }

    // Comment out phone validation
    // if (formData.phone && !/^\d+$/.test(formData.phone)) {
    //   toast.error("Phone number must contain only numbers");
    //   return;
    // }

    // Password strength validation
    const strength = checkPasswordStrength(formData.password);
    if (strength.strength === 'weak') {
      toast.error(strength.message || "Password is too weak. Must be at least 8 characters with letters and numbers");
      return;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        // phone: formData.phone // Commented out phone field
      });

      // Store email in localStorage for potential password reset
      localStorage.setItem('userEmail', formData.email);

      toast.success("Registration successful! Please verify your email.");
      setTimeout(() => {
        navigate("/verify-email", { 
          state: { email: formData.email }
        });
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join our community today</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="form-input"
              required
            />
          </div>

          {/* Comment out phone input field */}
          {/* <div className="form-group">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number (Optional)"
              className="form-input"
            />
          </div> */}

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="form-input"
              required
            />
            {formData.password && (
              <>
                <div className="password-strength-bar">
                  <div 
                    className="strength-indicator"
                    style={{
                      width: `${(passwordStrength.strength === 'weak' ? 33 : 
                               passwordStrength.strength === 'medium' ? 66 : 
                               passwordStrength.strength === 'strong' ? 100 : 0)}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
                <p className="password-strength-text" style={{ color: passwordStrength.color }}>
                  Password Strength: {passwordStrength.strength}
                </p>
              </>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="signup-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
    </>
  );
};

export default Signup;

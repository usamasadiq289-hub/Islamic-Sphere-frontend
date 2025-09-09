import "./Contact.css";
import { FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPhoneAlt, FaPaperPlane, FaCheck } from "react-icons/fa";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import AuthService from '../apis/auth';
import SupportService from '../apis/support';
import { toast } from 'react-toastify';

const Contact = () => {
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    // Load user data
    const user = AuthService.getCurrentUser();
    if (user) {
      setUserData(user);
      setFormData({
        ...formData,
        firstName: user.firstName || user.username.split(' ')[0],
        lastName: user.lastName || (user.username.split(' ')[1] || ''),
        email: user.email
      });
    }
  }, []);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) {
      toast.error('Please login to submit a support ticket');
      return;
    }

    setIsSubmitting(true);
    try {
      await SupportService.createSupport(formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Only reset subject and message, keep name and email
      setFormData(prev => ({
        ...prev,
        subject: "",
        message: ""
      }));
      
      toast.success('Message sent successfully!');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error.message || 'Failed to send message');
    }
  };

  const contactMethods = [
    {
      icon: <FaEnvelope className="contactpage-icon" />,
      title: "Email Us",
      detail: "islamicsphereorg@gmail.com",
      link: "mailto:islamicsphereorg@gmail.com"
    },
    // {
    //   icon: <FaGlobe className="contactpage-icon" />,
    //   title: "Visit Us",
    //   detail: "www.islamicsphere.app",
    //   link: "https://www.islamicsphere.app"
    // },
    {
      icon: <FaMapMarkerAlt className="contactpage-icon" />,
      title: "Our Location",
      detail: "Lahore, Pakistan"
    },
    {
      icon: <FaPhoneAlt className="contactpage-icon" />,
      title: "Call Us",
      detail: "+92 321 4843175"
    }
  ];

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Navbar />
    <section className="contactpage-section  ">
     
      <div className="contactpage-container ">
        <div className="contactpage-header">
          <h1 className="contactpage-title">Get In Touch</h1>
          <p className="contactpage-subtitle">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="contactpage-content">
          <div className="contactpage-info">
            {contactMethods.map((method, index) => (
              <a 
                href={method.link} 
                key={index} 
                className="contactpage-method"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="contactpage-icon-container">
                  {method.icon}
                </div>
                <div>
                  <h3 className="contactpage-method-title">{method.title}</h3>
                  <p className="contactpage-method-detail">{method.detail}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="contactpage-form-container">
            {isSubmitted ? (
              <div className="contactpage-success">
                <FaCheck className="contactpage-success-icon" />
                <h3>Message Sent Successfully!</h3>
                <p>We'll get back to you as soon as possible. JazakAllah Khair for reaching out!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contactpage-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="contactpage-form-group">
                    <label htmlFor="firstName" className="contactpage-label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      // onChange={handleChange}
                      readOnly
                      className="contactpage-input"
                      required
                      placeholder="First name"
                    />
                  </div>
                  <div className="contactpage-form-group">
                    <label htmlFor="lastName" className="contactpage-label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      // onChange={handleChange}
                      readOnly
                      className="contactpage-input"
                      placeholder="Last name (optional)"
                    />
                  </div>
                </div>

                <div className="contactpage-form-group">
                  <label htmlFor="email" className="contactpage-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="contactpage-input bg-gray-100"
                    required
                  />
                </div>

                <div className="contactpage-form-group">
                  <label htmlFor="subject" className="contactpage-label">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="contactpage-input"
                    required
                    placeholder="What's this about?"
                  />
                </div>

                <div className="contactpage-form-group">
                  <label htmlFor="message" className="contactpage-label">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="contactpage-textarea"
                    rows="5"
                    required
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="contactpage-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <FaPaperPlane className="contactpage-submit-icon" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}

            
          </div>

        </div>

      </div>
     

    </section>
     <Footer />
</div>
  );
};

export default Contact; 
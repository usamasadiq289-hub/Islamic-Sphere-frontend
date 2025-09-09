import React, { useEffect } from "react";
import "./LearnMore.css";
import { FaUsers, FaHandHoldingHeart, FaQuran, FaBalanceScale } from "react-icons/fa";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const LearnMore = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const benefits = [
    {
      icon: <FaUsers className="learnmore-icon" />,
      title: "Ummah Connection",
      description: "Experience the power of Ummah through our community groups where faith grows stronger together."
    },
    {
      icon: <FaHandHoldingHeart className="learnmore-icon" />,
      title: "Emotional Support",
      description: "Find solace and guidance by connecting your feelings with relevant Quranic verses and Hadith."
    },
    {
      icon: <FaQuran className="learnmore-icon" />,
      title: "Structured Learning",
      description: "Follow carefully designed learning paths that make understanding Islam accessible to everyone."
    },
    {
      icon: <FaBalanceScale className="learnmore-icon" />,
      title: "Life Balance",
      description: "Harmonize your spiritual and worldly responsibilities with our practical Islamic guidance."
    }
  ];

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Navbar />
      
      <section className="learnmore-section">
        <div className="learnmore-content">
          <header className="learnmore-header">
            <h1 className="learnmore-title">Discover the Power of Islamic Community</h1>
            <p className="learnmore-subtitle">
              Join thousands of believers on a journey of faith, knowledge, and spiritual growth
            </p>
          </header>

          <div className="learnmore-features">
            {benefits.map((benefit, index) => (
              <div key={index} className="learnmore-card">
                <div className="learnmore-icon-container">
                  {benefit.icon}
                </div>
                <h3 className="learnmore-card-title">{benefit.title}</h3>
                <p className="learnmore-card-desc">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="learnmore-main-content">
            <h2 className="learnmore-heading">Why Group Learning Matters in Islam</h2>
            <p className="learnmore-text">
              Islam teaches us the importance of <strong>Ummah</strong>, the concept of a united community.
              At Islamic Sphere, we bring this teaching to life by creating digital spaces where believers can
              grow together in faith, share responsibilities, and support one another on the path of Deen.
            </p>
            <p className="learnmore-text">
              In today's fast-paced world, maintaining spiritual balance can be challenging. That's why we've
              integrated emotional well-being with Islamic teachings, helping you find relevant spiritual guidance
              from the Quran and Hadith that speaks directly to your life's circumstances.
            </p>
            <p className="learnmore-text">
              Whether you're a student seeking knowledge, a professional balancing work and faith, or someone on
              a personal spiritual journey, Islamic Sphere provides the tools and community you need to build a
              meaningful, balanced, and spiritually connected life.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LearnMore; 
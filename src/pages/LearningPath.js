import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaPray, FaHandHoldingUsd, FaMosque, FaBook, FaHeart, FaQuran, FaStar } from 'react-icons/fa';
import './LearningPath.css';
import Footer from '../components/Footer';
import { useEffect } from 'react';

const sections = [
  {
    id: 'quran-reader',
    title: 'Quran Reader',
    icon: <FaQuran className="section-icon" />,
    description: 'Read and listen to the Holy Quran with translation. Select a Surah and Ayah to begin.',
    topics: ['Full Quran Access', 'Ayah by Ayah Translation', 'Multiple Recitations']
  },
  {
    id: 'prayer',
    title: 'Prayer (Salah)',
    icon: <FaPray className="section-icon" />,
    description: 'Learn the fundamentals of prayer, its importance, and how to perform it correctly according to Islamic teachings.',
    topics: ['Prayer Times & Schedule', 'Wudu (Ablution)', 'Prayer Positions & Movements', 'Essential Duas in Prayer']
  },
  {
    id: 'zakat',
    title: 'Zakat & Charity',
    icon: <FaHandHoldingUsd className="section-icon" />,
    description: 'Understand the principles of Zakat, calculation methods, and its significance in purifying wealth.',
    topics: ['Zakat Calculation Methods', 'Types of Zakat', 'Eligibility Criteria', 'Distribution Guidelines']
  },
  {
    id: 'hajj',
    title: 'Hajj & Umrah',
    icon: <FaMosque className="section-icon" />,
    description: 'Comprehensive guide to performing the sacred pilgrimage of Hajj and Umrah rituals.',
    topics: ['Pilgrimage Preparation', 'Sacred Rituals', 'Essential Duas', 'Practical Tips & Guidelines']
  },
  {
    id: 'quran',
    title: 'Quran Studies',
    icon: <FaBook className="section-icon" />,
    description: 'Learn proper Quran recitation, tajweed rules, and deepen your understanding of verses.',
    topics: ['Tajweed Rules & Pronunciation', 'Memorization Techniques', 'Translation & Meaning', 'Tafsir & Commentary']
  },
  {
    id: 'character',
    title: 'Islamic Character',
    icon: <FaHeart className="section-icon" />,
    description: 'Develop noble character traits and moral excellence based on Islamic teachings and prophetic guidance.',
    topics: ['Islamic Manners (Adab)', 'Ethics & Morality', 'Social Relations', 'Personal Development']
  }
];

const LearningPath = () => {
  
  useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  // Generate random particles for hero section
  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`
      });
    }
    return particles;
  };

  const particles = generateParticles();

  return (
    <div className="learning-path-wrapper ">
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="learning-hero-section">
        {/* <div className="learning-hero-particles">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.animationDelay
              }}
            ></div>
          ))}
        </div> */}
        <div className="learning-hero-content">
          <div className="hero-badge">Islamic Education</div>
          <h1>Islamic Learning Path</h1>
          <p>Embark on your journey of Islamic knowledge through our structured learning paths designed to strengthen your faith and understanding</p>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
          <div className="scroll-text">Explore Paths</div>
        </div>
      </section>

      {/* Learning Sections */}
      <section className="learning-sections-container">
        <div className="container">
          <h2 className="section-title-main">Choose Your Learning Journey</h2>
          <p className="section-subtitle">
            Discover comprehensive Islamic education paths designed to deepen your understanding and strengthen your connection with Allah
          </p>
          <div className="learning-sections-grid">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="learning-section"
                style={{
                  '--section-index': index,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '420px',
                  height: '100%'
                }}
              >
                <div>
                  <div className="section-icon-wrapper">
                    {section.icon}
                  </div>
                  <h3 className="section-title">{section.title}</h3>
                  <p className="section-description">{section.description}</p>
                  <div className="topics-list">
                    {section.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="topic-item">
                        <FaStar className="topic-icon" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
                  <Link
                    to={`/learn/${section.id}`}
                    className="section-button"
                    style={{
                      background: 'linear-gradient(90deg, #e0c33e 0%, #055160 100%)',
                      color: '#fff',
                      borderRadius: '999px',
                      padding: '0.6rem 2.2rem',
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      letterSpacing: '0.04em',
                      boxShadow: '0 2px 8px #e0c33e22',
                      transition: 'background 0.2s',
                      marginTop: '1.5rem',
                      marginBottom: '0.5rem',
                      textAlign: 'center',
                      minWidth: '160px',
                      outline: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-block'
                    }}
                  >
                    Start Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LearningPath;
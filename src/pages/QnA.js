import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaUserAlt, FaVideo, FaMapMarkerAlt, FaUsers, FaStar, FaRegClock, FaChalkboardTeacher, FaUserTie, FaQuestionCircle, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaStarAndCrescent, FaSearch } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import './QnA.css';
import SessionService from '../apis/session';
import ScholarService from '../apis/scholar';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the Home.css file for footer styling
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const DEFAULT_SESSION_IMAGE = '/images/default-session.jpg';  // Add this image to your public folder
const DEFAULT_SCHOLAR_IMAGE = '/images/default-scholar.jpg';  // Add this image to your public folder

const QnA = () => {

  useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  const [scholarCount, setScholarCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeScholar, setActiveScholar] = useState(null);
  const [showSessionDetails, setShowSessionDetails] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [scholars, setScholars] = useState([]);
  const [scholarLoading, setScholarLoading] = useState(true);
  const [scholarError, setScholarError] = useState(null);
  const [featuredSessions, setFeaturedSessions] = useState([]);
  const [scholarSearchQuery, setScholarSearchQuery] = useState('');

  // Format date to display in a more readable format

  const navigate = useNavigate();


  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get scholar by ID
  const getScholarById = (id) => {
    return scholars.find(scholar => scholar._id === id);
  };

  // Filter sessions by scholar ID
  const getScholarSessions = (scholarId) => {
    return sessions.filter(session => session.scholarSession === scholarId);
  };

  // Filter scholars based on search query
  const filteredScholars = scholars.filter(scholar =>
    scholar.name.toLowerCase().includes(scholarSearchQuery.toLowerCase()) ||
    scholar.specialty.toLowerCase().includes(scholarSearchQuery.toLowerCase()) ||
    (scholar.bio && scholar.bio.toLowerCase().includes(scholarSearchQuery.toLowerCase()))
  );

  // Clear active scholar if they're not in filtered results
  useEffect(() => {
    if (activeScholar && scholarSearchQuery && !filteredScholars.some(scholar => scholar._id === activeScholar._id)) {
      setActiveScholar(null);
    }
  }, [filteredScholars, activeScholar, scholarSearchQuery]);

  // Function to highlight search terms
  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm.trim()})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  // Join session handler - now supports multiple platforms
  const handleJoinSession = (meetingLink, platform = 'zoom') => {
    window.open(meetingLink, '_blank');
  };

  // Get platform-specific icon and text
  const getPlatformInfo = (platform) => {
    switch (platform) {
      case 'googlemeet':
        return {
          icon: '📹',
          name: 'Google Meet',
          buttonText: 'Join Google Meet'
        };
      case 'zoom':
      default:
        return {
          icon: '🎥',
          name: 'Zoom',
          buttonText: 'Join Zoom Meeting'
        };
    }
  };

  // Fetch both scholars and sessions data
  const fetchData = async () => {
    setLoading(true);
    setScholarLoading(true);
    try {
      // Fetch scholars
      const scholarsResponse = await ScholarService.getScholars();
      if (scholarsResponse.success) {
        setScholars(scholarsResponse.data);
        setActiveScholar(scholarsResponse.data[0]); // Set first scholar as active
      } else {
        setScholarError(scholarsResponse.message);
      }

      // Fetch sessions
      const sessionsResponse = await SessionService.getSessions();
      if (sessionsResponse.success) {
        setSessions(sessionsResponse.data);
        // Filter featured sessions
        const featured = sessionsResponse.data.filter(session =>
          new Date(session.date) >= new Date() &&
          session.featured
        );
        setFeaturedSessions(featured);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setScholarError('Failed to fetch data');
    } finally {
      setLoading(false);
      setScholarLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Fetch real-time scholar and session counts
    const fetchCounts = async () => {
      try {
        const scholarCount = await ScholarService.getScholarCount();
        setScholarCount(scholarCount);
        const sessionCount = await SessionService.getSessionCount();
        setSessionCount(sessionCount);
      } catch (err) {
        // Optionally handle errors
      }
    };
    fetchCounts();
  }, []);

  // Toggle FAQ item expansion
  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

 
  const isSessionLive = (date, startTime, endTime) => {
    const sessionStartDateTime = new Date(`${date}T${startTime}`);
    const sessionEndDateTime = new Date(`${date}T${endTime}`);
    const now = new Date();
    return now >= sessionStartDateTime && now <= sessionEndDateTime;
  };

  const isSessionReadyToJoin = (date, startTime, endTime) => {
    // Session is ready to join if it's currently live
    return isSessionLive(date, startTime, endTime);
  };

  // Check if a session has already ended
  const isPastSession = (date, endTime) => {
    const sessionEndDateTime = new Date(`${date}T${endTime}`);
    const now = new Date();
    return now > sessionEndDateTime;
  };

  // Check if a session is upcoming (not started yet)
  const isUpcomingSession = (date, startTime) => {
    const sessionStartDateTime = new Date(`${date}T${startTime}`);
    const now = new Date();
    return now < sessionStartDateTime;
  };

  // Format time to AM/PM format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Get month from date string
  const getMonthFromDate = (dateString) => {
    return new Date(dateString).toLocaleString('default', { month: 'short' });
  };

  // Get day from date string
  const getDayFromDate = (dateString) => {
    return new Date(dateString).getDate();
  };

  // Calculate time remaining until session
  const getTimeUntilSession = (date, startTime) => {
    const sessionDateTime = new Date(`${date}T${startTime}`);
    const now = new Date();
    const diffMs = sessionDateTime - now;

    if (diffMs < 0) return 'Session has started';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000); // Calculate seconds

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHrs} hr${diffHrs > 1 ? 's' : ''} ${diffMins} min${diffMins > 1 ? 's' : ''} ${diffSecs} sec${diffSecs > 1 ? 's' : ''}`;
    } else if (diffHrs > 0) {
      return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ${diffMins} min${diffMins > 1 ? 's' : ''} ${diffSecs} sec${diffSecs > 1 ? 's' : ''}`;
    } else {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ${diffSecs} sec${diffSecs > 1 ? 's' : ''}`;
    }
  };

  // State for countdown timers
  const [countdowns, setCountdowns] = useState({});

  // Generate random particles for hero section
  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < 30; i++) {
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



  // Update countdown timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCountdowns = {};

      featuredSessions.forEach(session => {
        const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
        const now = new Date();
        const diffMs = sessionDateTime - now;

        if (diffMs > 0) {
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

          updatedCountdowns[session.id] = {
            timeString: `${days}d ${hours}h ${minutes}m ${seconds}s`,
            progressPercent: Math.max(0, Math.min(100, 100 - (diffMs / (24 * 60 * 60 * 1000)) * 10))
          };
        } else {
          updatedCountdowns[session.id] = {
            timeString: 'Live Now!',
            progressPercent: 100
          };
        }
      });

      setCountdowns(updatedCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="qna-container w-full min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div className="qna-hero">
        <div className="qna-hero-overlay"></div>
        <div className="qna-hero-particles">
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
        </div>
        <div className="qna-hero-content">
          <div className="hero-badge">Live Q&A Sessions</div>
          <h1>Ask Your Questions</h1>
          <p>Connect with renowned scholars and get answers to your most pressing questions</p>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-number">{scholarCount}</div>
              <div className="stat-label">Scholars</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">{sessionCount}</div>
              <div className="stat-label">Sessions</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">100+</div>
              <div className="stat-label">Questions Answered</div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
          <div className="scroll-text">Scroll Down</div>
        </div>
      </div>
      
      

      {/* Scholars Section */}
      <section className="scholars-section">
        <div className="section-header">
          <h2><FaUserTie className="section-icon" /> Our Scholars</h2>
          <p>Learn from the best Islamic scholars from around the world</p>
        </div>

        {/* Scholar Search Bar */}
        <div className="scholar-search-container">
          <div className="scholar-search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search scholars by name, specialty, or expertise..."
              value={scholarSearchQuery}
              onChange={(e) => setScholarSearchQuery(e.target.value)}
              className="scholar-search-input"
            />
            {scholarSearchQuery && (
              <button
                onClick={() => setScholarSearchQuery('')}
                className="clear-search-btn"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          {scholarSearchQuery && (
            <div className="search-results-info">
              {filteredScholars.length} scholar{filteredScholars.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>

        {scholarLoading && (
          <div className="flex justify-center items-center py-8">
            <span className="text-lg text-blue-600 font-semibold">Loading scholars...</span>
          </div>
        )}

        {scholarError && (
          <div className="flex justify-center items-center py-8">
            <span className="text-lg text-red-600 font-semibold">{scholarError}</span>
          </div>
        )}

        {!scholarLoading && !scholarError && scholars.length > 0 && (
          <div className="scholars-container">
            <div className="scholars-list">
              {filteredScholars.length > 0 ? (
                filteredScholars.map(scholar => (
                  <div
                    key={scholar._id}
                    className={`scholar-card ${activeScholar?._id === scholar._id ? 'active' : ''}`}
                    onClick={() => setActiveScholar(scholar)}
                  >
                    <div className="scholar-image">
                      <img 
                        src={scholar.image ? `https://islamic-sphere-backend-two.vercel.app/uploads/${scholar.image}` : DEFAULT_SCHOLAR_IMAGE} 
                        alt={scholar.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_SCHOLAR_IMAGE;
                        }}
                      />
                      <div className="scholar-rating">
                        <FaStar /> {scholar.rating}
                      </div>
                    </div>
                    <div className="scholar-info">
                      <h3 
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(scholar.name, scholarSearchQuery)
                        }}
                      />
                      <p 
                        className="scholar-specialty"
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(scholar.specialty, scholarSearchQuery)
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-scholars-found">
                  <p>No scholars found matching "{scholarSearchQuery}"</p>
                  <button
                    onClick={() => setScholarSearchQuery('')}
                    className="clear-search-suggestion"
                  >
                    Clear search to see all scholars
                  </button>
                </div>
              )}
            </div>

            {/* Scholar Details */}
            {activeScholar && (
              <div className="scholar-details">
                <div className="scholar-profile">
                  <div className="scholar-header">
                    <div className="scholar-large-image">
                      <img 
                        src={activeScholar.image ? `https://islamic-sphere-backend-two.vercel.app/uploads/${activeScholar.image}` : DEFAULT_SCHOLAR_IMAGE} 
                        alt={activeScholar.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_SCHOLAR_IMAGE;
                        }}
                      />
                    </div>
                    <div className="scholar-header-info">
                      <h2>{activeScholar.name}</h2>
                      <p className="scholar-specialty">{activeScholar.specialty}</p>
                      <div className="scholar-stats">
                        <div className="stat">
                          <FaRegClock /> {activeScholar.sessions} Sessions
                        </div>
                        <div className="stat">
                          <FaUsers /> {activeScholar.students} Students
                        </div>
                        <div className="stat">
                          <FaStar /> {activeScholar.rating} Rating
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="scholar-bio">
                    <h3>About</h3>
                    <p>{activeScholar.bio}</p>
                    <p className="scholar-availability">
                      <FaCalendarAlt /> Available: {activeScholar.availability}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="font-semibold">Languages:</span> {activeScholar.languages?.join(', ')}
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="font-semibold">Certifications:</span>
                    <ul className="list-disc list-inside ml-2">
                      {activeScholar.certifications?.map((cert, idx) => (
                        <li key={idx}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                </div>

               
              </div>
            )}
          </div>
        )}
      </section>

      {/* Featured Sessions Section */}
      <section className="featured-sessions-section">
        {/* <div className="section-header">
          <div className="section-badge">Don't Miss Out</div>
          <h2><FaCalendarAlt className="section-icon" /> Featured Sessions</h2>
          <p>Join our most popular and highly anticipated Q&A sessions</p>
        </div> */}

        <div className="featured-sessions-container">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <span className="text-lg text-blue-600 font-semibold">Loading sessions...</span>
            </div>
          ) : (
            featuredSessions.map(session => {
              const scholar = getScholarById(session.scholarSession);
              return (
                <div key={session._id} className="featured-session-card">
                  <div className="featured-session-image">
                    <img src={scholar.image} alt={scholar.name} />
                    {isSessionLive(session.date, session.startTime) && (
                      <div className="featured-live-badge">LIVE NOW</div>
                    )}
                  </div>
                  <div className="featured-session-content">
                    <h3>{session.topic}</h3>
                    <div className="featured-session-scholar">
                      <span>{scholar.name}</span> | <span>{scholar.specialty}</span>
                    </div>
                    <p className="featured-session-description">{session.description}</p>
                    <div className="featured-session-details">
                      <div className="detail">
                        <FaCalendarAlt /> {formatDate(session.date)}
                      </div>
                      <div className="detail">
                        <FaClock /> {session.startTime} - {session.endTime}
                      </div>
                      <div className="detail">
                        <FaUsers /> {session.participants}/{session.maxParticipants} participants
                      </div>
                    </div>
                    <div className="featured-session-countdown">
                      <div className="countdown-label">Starts in:</div>
                      <div className="countdown-timer">{getTimeUntilSession(session.date, session.startTime)}</div>
                      <div className="countdown-progress">
                        <div className="countdown-bar" style={{
                          width: `${Math.min(100, (1 - (new Date(`${session.date}T${session.startTime}`) - new Date()) / (1000 * 60 * 60 * 24 * 7)) * 100)}%`
                        }}></div>
                      </div>
                    </div>
                    <button
                      className={`featured-join-button ${isSessionReadyToJoin(session.date, session.startTime) ? 'active' : 'disabled'}`}
                      onClick={() => isSessionReadyToJoin(session.date, session.startTime) && handleJoinSession(session.zoomLink, session.meetingPlatform)}
                      disabled={!isSessionReadyToJoin(session.date, session.startTime)}
                    >
                      <FaVideo /> {isSessionLive(session.date, session.startTime) ? 
                        `Join Live on ${getPlatformInfo(session.meetingPlatform).name}` :
                        isSessionReadyToJoin(session.date, session.startTime) ? 
                        getPlatformInfo(session.meetingPlatform).buttonText : 'Remind Me'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Today's Sessions and Upcoming Sessions sections */}
      <div>
        {/* Today's Featured Sessions */}
        <div className="featured-sessions-section">
          <div className="section-container">
            <div className="section-badge">Today</div>
            <h2 className="section-tot">Live & Today's Sessions</h2>
            <p className="section-description">Join our live Q&A sessions happening today</p>

            <div className="featured-sessions-container">
              {sessions.filter(session => {
                const sessionDate = new Date(session.date);
                const today = new Date();
                
                // Check if session is today
                const isToday = (
                  sessionDate.getDate() === today.getDate() &&
                  sessionDate.getMonth() === today.getMonth() &&
                  sessionDate.getFullYear() === today.getFullYear()
                );
                
                // Only show today's sessions (including ended ones)
                return isToday;
              }).map(session => {
                const isLive = isSessionLive(session.date, session.startTime, session.endTime);
                const isReadyToJoin = isSessionReadyToJoin(session.date, session.startTime, session.endTime);
                const isPast = isPastSession(session.date, session.endTime);
                const isUpcoming = isUpcomingSession(session.date, session.startTime);

                // Get scholar data from the populated scholarSession
                const scholar = session.scholarSession;

                // Use actual session and scholar data
                const sessionImg = session.image || 'https://via.placeholder.com/400x200?text=Islamic+Session';
                const scholarImg = scholar?.image ? `https://islamic-sphere-backend-two.vercel.app/uploads/${scholar.image}` : DEFAULT_SCHOLAR_IMAGE;
                const scholarName = scholar?.name || 'Scholar';

                return (
                  <div key={session._id} className="featured-session-card">
                    {/* <div className="featured-session-image">
                      <img
                        src={sessionImg}
                        alt={session.title || session.name || 'Session'}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_SESSION_IMAGE;
                        }}
                      />
                      {isLive && <div className="featured-live-badge">LIVE NOW</div>}
                    </div> */}
                    <div className="featured-session-content">
                      <div className="session-header">
                        <h3>{session.title || session.name}</h3>
                        <div className="platform-badge" title={`Meeting via ${getPlatformInfo(session.meetingPlatform).name}`}>
                          {getPlatformInfo(session.meetingPlatform).icon} {getPlatformInfo(session.meetingPlatform).name}
                        </div>
                      </div>
                      <div className="featured-session-scholar">
                        <div className="scholar-avatar">
                          <img
                            src={scholarImg}
                            alt={scholarName}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_SCHOLAR_IMAGE;
                            }}
                          />
                        </div>
                        <span>{scholarName}</span>
                        {/* {scholar?.specialty && <span className="scholar-specialty"> | {scholar.specialty}</span>} */}
                      </div>
                      <p className="featured-session-description">{session.description}</p>

                      <div className="featured-session-details">
                        <div className="detail">
                          <FaCalendarAlt /> {formatDate(session.date)}
                        </div>
                        <div className="detail">
                          <FaClock /> {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </div>
                        <div className="detail">
                          <FaMapMarkerAlt /> {session.location || 'Online via Zoom/Google Meet'}
                        </div>
                      </div>

                      {isUpcoming && countdowns[session._id || session.id] && (
                        <div className="featured-session-countdown">
                          <div className="countdown-label">Starting in:</div>
                          <div className="countdown-timer">{countdowns[session._id || session.id].timeString}</div>
                          <div className="countdown-progress">
                            <div
                              className="countdown-bar"
                              style={{ width: `${countdowns[session._id || session.id].progressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {isLive && (
                        <div className="featured-session-live-indicator">
                          <div className="live-pulse"></div>
                          <span>This session is live now!</span>
                        </div>
                      )}

                      <div className="featured-session-countdown">
                        <div className="countdown-label">Starts in:</div>
                        <div className="countdown-timer">{getTimeUntilSession(session.date, session.startTime)}</div>
                        <div className="countdown-progress">
                          <div className="countdown-bar" style={{
                            width: `${Math.min(100, (1 - (new Date(`${session.date}T${session.startTime}`) - new Date()) / (1000 * 60 * 60 * 24 * 7)) * 100)}%`
                          }}></div>
                        </div>
                      </div>

                      <button
                        className={`featured-join-button ${isLive ? 'active' : ''} ${isPast ? 'disabled' : ''}`}
                        onClick={() => handleJoinSession(session.zoomLink, session.meetingPlatform)}
                        disabled={!isLive}
                      >
                        {isLive ? (
                          <>
                            <FaVideo /> {getPlatformInfo(session.meetingPlatform).buttonText}
                          </>
                        ) : isPast ? (
                          'Session Ended'
                        ) : (
                          <>
                            <FaRegClock /> Upcoming Today
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
              {sessions.filter(session => {
                const sessionDate = new Date(session.date);
                const today = new Date();
                
                // Check if session is today
                const isToday = (
                  sessionDate.getDate() === today.getDate() &&
                  sessionDate.getMonth() === today.getMonth() &&
                  sessionDate.getFullYear() === today.getFullYear()
                );
                
                // Only show today's sessions for the no-sessions message check
                return isToday;
              }).length === 0 && (
                  <div className="no-sessions-message">
                    <p className='no-message'>No sessions scheduled for today. Check out our upcoming sessions below!</p>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="featured-sessions-section mt-12">
          <div className="section-container">
            <div className="section-badge">Upcoming</div>
            <h2 className="section-tot">Future Sessions</h2>
            <p className="section-description">Browse and register for our upcoming Q&A sessions</p>

            <div className="featured-sessions-container">
              {sessions.filter(session => {
                const sessionDate = new Date(session.date);
                const today = new Date();
                
                // Check if session is in the future (not today)
                const isFutureDate = sessionDate > today;
                
                // Check if session is today
                const isToday = (
                  sessionDate.getDate() === today.getDate() &&
                  sessionDate.getMonth() === today.getMonth() &&
                  sessionDate.getFullYear() === today.getFullYear()
                );
                
                // Only show future sessions (exclude today's sessions and past dates)
                return isFutureDate && !isToday;
              }).map(session => {
                const isLive = isSessionLive(session.date, session.startTime, session.endTime);
                const isReadyToJoin = isSessionReadyToJoin(session.date, session.startTime, session.endTime);
                const isPast = isPastSession(session.date, session.endTime);
                const isUpcoming = isUpcomingSession(session.date, session.startTime);

                // Get scholar data from the populated scholarSession
                const scholar = session.scholarSession;

                // Use actual session and scholar data
                const sessionImg = session.image || 'https://via.placeholder.com/400x200?text=Upcoming+Session';
                const scholarImg = scholar?.image ? `https://islamic-sphere-backend-two.vercel.app/uploads/${scholar.image}` : DEFAULT_SCHOLAR_IMAGE;
                const scholarName = scholar?.name || 'Scholar';

                return (
                  <div key={session._id} className="featured-session-card">
                    {/* <div className="featured-session-image">
                      <img
                        src={sessionImg}
                        alt={session.title || session.name || 'Session'}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_SESSION_IMAGE;
                        }}
                      />
                    </div> */}
                    <div className="featured-session-content">
                      <div className="session-header">
                        <h3>{session.title || session.name}</h3>
                        <div className="platform-badge" title={`Meeting via ${getPlatformInfo(session.meetingPlatform).name}`}>
                          {getPlatformInfo(session.meetingPlatform).icon} {getPlatformInfo(session.meetingPlatform).name}
                        </div>
                      </div>
                      <div className="featured-session-scholar">
                        <div className="scholar-avatar">
                          <img
                            src={scholarImg}
                            alt={scholarName}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_SCHOLAR_IMAGE;
                            }}
                          />
                        </div>
                        <span>{scholarName}</span>
                        {scholar?.specialty && <span className="scholar-specialty"> | {scholar.specialty}</span>}
                      </div>
                      <p className="featured-session-description">{session.description}</p>

                      <div className="featured-session-details">
                        <div className="detail">
                          <FaCalendarAlt /> {formatDate(session.date)}
                        </div>
                        <div className="detail">
                          <FaClock /> {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </div>
                        <div className="detail">
                          <FaMapMarkerAlt /> Online via {getPlatformInfo(session.meetingPlatform).name}
                        </div>
                      </div>

                      <button
                        className="featured-join-button"
                      // onClick={() => handleJoinSession(session.zoomLink)}
                      >
                        <FaRegClock /> Upcoming
                      </button>
                    </div>
                  </div>
                );
              })}
              {sessions.filter(session => {
                const sessionDate = new Date(session.date);
                const today = new Date();
                
                // Check if session is in the future (not today)
                const isFutureDate = sessionDate > today;
                
                // Check if session is today
                const isToday = (
                  sessionDate.getDate() === today.getDate() &&
                  sessionDate.getMonth() === today.getMonth() &&
                  sessionDate.getFullYear() === today.getFullYear()
                );
                
                // Only show future sessions for the no-sessions message check
                return isFutureDate && !isToday;
              }).length === 0 && (
                  <div className="no-sessions-message">
                    <p>No upcoming sessions scheduled yet. Check back soon!</p>
                  </div>
                )}
            </div>
          </div>
        </div>

      </div>

      <Footer />






    </div>
  );
};

export default QnA;
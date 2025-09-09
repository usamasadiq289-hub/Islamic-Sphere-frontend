import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
// import './Events.css';
import EventService from '../apis/events';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Groups.css';

import Footer from '../components/Footer';
const PRIMARY = "from-[#0a7e98] to-[#055160]";
const ACCENT = "bg-[#e0c33e] text-[#055160]";

const Events = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState([]); // New state for events
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedCity, setSelectedCity] = useState('All');
  const [showDropdown, setShowDropdown] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await EventService.getEvents();
      if (response.success) {
        // Add debug logs
        console.log('Raw events:', response.data);

        const formattedEvents = response.data.map(event => {
          // Parse date string to ensure proper Date object creation
          const eventDate = new Date(event.date);
          console.log('Event date parsing:', {
            original: event.date,
            parsed: eventDate,
            isValid: !isNaN(eventDate)
          });

          return {
            ...event,
            date: eventDate
          };
        });

        console.log('Formatted events:', formattedEvents);
        setEvents(formattedEvents);
      } else {
        console.error('Failed to fetch events:', response.message);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.calendar-day-container')) {
        setShowDropdown(null);
      }
      if (showDatePicker && !event.target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showDatePicker]);

  const getDaysInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const filteredEvents = events.filter(event => selectedCity === 'All' || event.city === selectedCity);
  const cities = ['All', ...new Set(events.map(event => event.city).filter(Boolean))];

  const hasEventOnDate = (date) => {
    return filteredEvents.some(event => {
      // Debug log for date comparison
      console.log('Comparing dates:', {
        calendarDate: date,
        eventDate: event.date,
        isSameDay: isSameDay(new Date(event.date), date)
      });
      return isSameDay(new Date(event.date), date);
    });
  };

  const getEventsForDate = (date) => {
    return filteredEvents.filter(event => isSameDay(event.date, date));
  };

  const handleDateClick = (date) => {
    const dateEvents = getEventsForDate(date);
    if (dateEvents.length === 1) {
      setSelectedEvent(dateEvents[0]);
      setShowEventModal(true);
    } else if (dateEvents.length > 1) {
      // Toggle dropdown for multiple events
      const dateKey = format(date, 'yyyy-MM-dd');
      setShowDropdown(showDropdown === dateKey ? null : dateKey);
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
    setShowDropdown(null);
  };

  const handleMonthYearChange = (year, month) => {
    setCurrentDate(new Date(year, month, 1));
    setShowDatePicker(false);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-xl text-gray-600">Loading events...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <div className="header-section Events">
        <div className="islamic-elements">
          <div className="islamic-decoration"></div>
          <div className="islamic-star"></div>
          <div className="islamic-crescent"></div>
          <div className="islamic-pattern"></div>
          <div className="islamic-dome"></div>
          <div className="islamic-arch"></div>
        </div>
        <div className="header-content">
          <div className="hero-badge">Islamic Calendar</div>
          <h1 className="animated-gradient-heading"><span>Islamic Events calender</span></h1>
          <p className="header-description">
            Connect with others, <strong>share Events</strong>, and grow together in faith
          </p>
          <p className="header-description">
            <strong>Please check Below</strong>
          </p>

          {/* <button
                className="create-group-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="fas fa-plus-circle mr-2"></i>
                Create New Group
              </button> */}
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
          <div className="scroll-text">Explore Events</div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto pt-20 px-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mt-8 border border-[#e0f7fa] relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-[#e0c33e]/30 to-[#055160]/10 blur-2xl opacity-60 pointer-events-none"></div>
          <div className="flex justify-between items-center mb-10">
            <div className="relative date-picker-container">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="text-3xl font-extrabold text-[#055160] tracking-tight drop-shadow-lg flex items-center gap-3 hover:text-[#e0c33e] transition-colors duration-200 cursor-pointer"
              >
                <span className="inline-block w-2 h-8 bg-gradient-to-b from-[#e0c33e] to-[#055160] rounded-full mr-2"></span>
                {format(currentDate, 'MMMM yyyy')}
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-5 h-5 transition-transform duration-200 ${showDatePicker ? 'rotate-180' : ''}`}
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Date Picker Dropdown */}
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-[#e0c33e]/30 z-50 p-6 min-w-[300px]">
                  <div className="space-y-4">
                    <div className="text-lg font-bold text-[#055160] mb-4">Select Month & Year</div>
                    
                    {/* Year Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-[#055160] mb-2">Year</label>
                      <select
                        value={currentDate.getFullYear()}
                        onChange={(e) => handleMonthYearChange(parseInt(e.target.value), currentDate.getMonth())}
                        className="w-full p-3 rounded-lg border-2 border-[#e0c33e]/50 text-[#055160] bg-white focus:ring-2 focus:ring-[#055160] focus:border-[#055160] transition-all duration-200"
                      >
                        {generateYearOptions().map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    {/* Month Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-[#055160] mb-2">Month</label>
                      <div className="grid grid-cols-3 gap-2">
                        {monthNames.map((month, index) => (
                          <button
                            key={month}
                            onClick={() => handleMonthYearChange(currentDate.getFullYear(), index)}
                            className={`p-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                              currentDate.getMonth() === index
                                ? 'bg-[#e0c33e] text-[#055160] shadow-md'
                                : 'bg-[#e0c33e]/10 text-[#055160] hover:bg-[#e0c33e]/20'
                            }`}
                          >
                            {month.substring(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Navigation */}
                    <div className="flex gap-2 pt-4 border-t border-[#e0c33e]/20">
                      <button
                        onClick={() => handleMonthYearChange(new Date().getFullYear(), new Date().getMonth())}
                        className="flex-1 px-4 py-2 bg-[#055160] text-white rounded-lg hover:bg-[#055160]/90 transition-colors duration-150 text-sm font-medium"
                      >
                        Today
                      </button>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="flex-1 px-4 py-2 bg-[#e0c33e]/20 text-[#055160] rounded-lg hover:bg-[#e0c33e]/30 transition-colors duration-150 text-sm font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label htmlFor="city-filter" className="sr-only">Filter by city</label>
                <select
                  id="city-filter"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="p-3 rounded-full bg-white/80 border-2 border-[#e0c33e]/50 text-[#055160] shadow transition focus:ring-2 focus:ring-[#055160]"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                  className="p-3 rounded-full bg-[#e0c33e]/20 hover:bg-[#e0c33e]/40 text-[#055160] shadow transition"
                  aria-label="Previous Month"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                  className="p-3 rounded-full bg-[#e0c33e]/20 hover:bg-[#e0c33e]/40 text-[#055160] shadow transition"
                  aria-label="Next Month"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-bold text-[#055160] py-2 uppercase tracking-wider text-sm drop-shadow">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {getDaysInMonth(currentDate).map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const hasEvent = dayEvents.length > 0;
              const dateKey = format(day, 'yyyy-MM-dd');
              const isDropdownOpen = showDropdown === dateKey;
              
              return (
                <div key={index} className="relative calendar-day-container">
                  <button
                    onClick={() => handleDateClick(day)}
                    className={`
                      relative flex flex-col items-end justify-start h-28 p-3 border-2 rounded-2xl transition-all duration-200 w-full
                      ${isSameMonth(day, currentDate) ? 'bg-white/90 text-[#055160]' : 'bg-[#e0f7fa]/60 text-[#b2ebf2]'}
                      ${hasEvent ? 'shadow-xl border-[#e0c33e] ring-2 ring-[#e0c33e]/40 hover:ring-[#055160]/60' : 'hover:bg-[#e0c33e]/10 border-[#e0f7fa]'}
                      group overflow-visible
                    `}
                    style={{ minHeight: '6rem' }}
                  >
                    <span className="block text-base font-bold mb-1 text-left">{format(day, 'd')}</span>
                    {hasEvent && (
                      <div className="flex flex-col gap-1 w-full mt-auto">
                        {dayEvents.length === 1 ? (
                          // Single event - show full event
                          <span
                            className="flex items-center gap-2 px-2 py-1 rounded-full shadow-md bg-gradient-to-r from-[#e0c33e] via-[#fffbe6] to-[#055160] border-2 border-[#e0c33e] relative"
                            style={{
                              boxShadow: '0 4px 16px 0 rgba(224,195,62,0.10), 0 1.5px 4px 0 rgba(5,81,96,0.10)'
                            }}
                          >
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/80 border border-[#e0c33e] shadow">
                              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                <path
                                  d="M15.5 10.5C14.5 13.5 11.5 15.5 8.5 14.5C6.5 13.9 5 12 5 10C5 7.2 7.2 5 10 5C11.2 5 12.3 5.5 13.1 6.3"
                                  stroke="#e0c33e"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <span className="truncate max-w-[5rem] text-[#055160] font-bold drop-shadow-sm">{dayEvents[0].title}</span>
                            {dayEvents[0].isSpecial && (
                              <span className="ml-1 text-[#e0c33e]">
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                  <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                                </svg>
                              </span>
                            )}
                          </span>
                        ) : (
                          // Multiple events - show count badge with same size as single event
                          <span
                            className="flex items-center gap-2 px-2 py-1 rounded-full shadow-md bg-gradient-to-r from-[#e0c33e] via-[#fffbe6] to-[#055160] border-2 border-[#e0c33e] relative cursor-pointer"
                            style={{
                              boxShadow: '0 4px 16px 0 rgba(224,195,62,0.10), 0 1.5px 4px 0 rgba(5,81,96,0.10)'
                            }}
                          >
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/80 border border-[#e0c33e] shadow">
                              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                <path
                                  d="M15.5 10.5C14.5 13.5 11.5 15.5 8.5 14.5C6.5 13.9 5 12 5 10C5 7.2 7.2 5 10 5C11.2 5 12.3 5.5 13.1 6.3"
                                  stroke="#e0c33e"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <span className="text-[#055160] font-bold drop-shadow-sm text-xs">
                              {dayEvents.length} Events
                            </span>
                            <span className="ml-1 text-[#055160]">
                              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </span>
                        )}
                      </div>
                    )}
                  </button>

                  {/* Dropdown for multiple events */}
                  {isDropdownOpen && dayEvents.length > 1 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border-2 border-[#e0c33e]/30 z-50 max-h-60 overflow-y-auto">
                      <div className="p-2">
                        <div className="text-xs font-bold text-[#055160] mb-2 px-2 py-1 bg-[#e0c33e]/10 rounded">
                          Events on {format(day, 'MMM d')}
                        </div>
                        {dayEvents.map((event, eventIdx) => (
                          <button
                            key={eventIdx}
                            onClick={() => handleEventSelect(event)}
                            className="w-full text-left p-2 rounded-lg hover:bg-[#e0c33e]/10 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 flex items-center justify-center rounded-full bg-[#e0c33e]/20 border border-[#e0c33e]">
                                <svg viewBox="0 0 20 20" fill="none" className="w-2 h-2">
                                  <path
                                    d="M15.5 10.5C14.5 13.5 11.5 15.5 8.5 14.5C6.5 13.9 5 12 5 10C5 7.2 7.2 5 10 5C11.2 5 12.3 5.5 13.1 6.3"
                                    stroke="#e0c33e"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-[#055160] truncate">
                                  {event.title}
                                </div>
                                <div className="text-xs text-gray-600 truncate">
                                  {event.startTime} - {event.endTime}
                                </div>
                              </div>
                              {event.isSpecial && (
                                <span className="text-[#e0c33e]">
                                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                                  </svg>
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 rounded-3xl max-w-md w-full p-10 shadow-2xl border-2 border-[#e0c33e]/30 relative animate-fade-in">
            <button
              onClick={() => setShowEventModal(false)}
              className="absolute top-4 right-4 text-[#055160] hover:text-[#e0c33e] text-3xl font-bold transition"
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex flex-col items-center gap-4">
              {selectedEvent.image && (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-24 h-24 rounded-full border-4 border-[#e0c33e] shadow-xl"
                />
              )}
              <h3 className="text-2xl font-extrabold text-[#055160] text-center drop-shadow">{selectedEvent.title}</h3>
              <p className="text-gray-600 text-center">{selectedEvent.description}</p>
              <div className="flex flex-col gap-2 w-full mt-2">
                <div className="flex items-center gap-2 text-[#055160] font-medium">
                  <span>🗓</span>
                  <span>{format(selectedEvent.date, 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-[#055160] font-medium">
                  <span>⏰</span>
                  <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-[#055160] font-medium">
                  <span>🏙️</span>
                  <span>{selectedEvent.city}</span>
                </div>
                <div className="flex items-center gap-2 text-[#055160] font-medium">
                  <span>📍</span>
                  <a
                    href={selectedEvent.locationLink || `https://www.google.com/maps/search/${encodeURIComponent(selectedEvent.location + ', ' + selectedEvent.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e0c33e] hover:text-[#055160] transition-colors duration-200 cursor-pointer hover:underline font-bold"
                  >
                    Location
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}




      {/* <section className="cta-section">
        <div className="container">
          <h2>Welcome Back!</h2>
          <p>Thank you for being a valued member of our community. Explore more features and connect with others!</p>
          <div className="cta-buttons">
            <button onClick={() => navigate('/groups')} className="primary-button">My Groups</button>
            <button onClick={() => navigate('/profile')} className="secondary-button">My Profile</button>
          </div>
        </div>
      </section> */}


      <Footer />

    </div>
  );
};

export default Events;
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import EventService from '../apis/events';
import { ToastContainer, toast } from 'react-toastify';
import './AdminEvents.css';

const AdminEvents = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'online',
    location: '',
    link: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await EventService.getEvents();
    if (response.success) {
      setEvents(response.data);
    } else {
      toast.error(response.message);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const response = await EventService.createEvent(formData);
    if (response.success) {
      toast.success('Event created successfully');
      setShowAddModal(false);
      fetchEvents();
      resetForm();
    } else {
      toast.error(response.message);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    const response = await EventService.updateEvent(selectedEvent._id, formData);
    if (response.success) {
      toast.success('Event updated successfully');
      setShowEventModal(false);
      fetchEvents();
      resetForm();
    } else {
      toast.error(response.message);
    }
  };

  const handleDeleteEvent = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const response = await EventService.deleteEvent(selectedEvent._id);
      if (response.success) {
        toast.success('Event deleted successfully');
        setShowEventModal(false);
        fetchEvents();
      } else {
        toast.error(response.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'online',
      location: '',
      link: ''
    });
  };

  const getDaysInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const hasEventOnDate = (date) => {
    return events.some(event => isSameDay(new Date(event.date), date));
  };

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const handleDateClick = (date) => {
    const dateEvents = getEventsForDate(date);
    if (dateEvents.length > 0) {
      setSelectedEvent(dateEvents[0]);
      setFormData(dateEvents[0]);
      setShowEventModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-20 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="add-event-btn"
              >
                + Add Event
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                  className="nav-btn"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                  className="nav-btn"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-header">
                {day}
              </div>
            ))}

            {getDaysInMonth(currentDate).map((day, index) => {
              const hasEvent = hasEventOnDate(day);
              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`calendar-day ${!isSameMonth(day, currentDate) ? 'text-gray-400' : ''} ${hasEvent ? 'has-event' : ''}`}
                >
                  <span className="day-number">{format(day, 'd')}</span>
                  {hasEvent && <div className="event-indicator" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {(showAddModal || showEventModal) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{showAddModal ? 'Add New Event' : 'Edit Event'}</h3>
              <button onClick={() => {
                showAddModal ? setShowAddModal(false) : setShowEventModal(false);
                resetForm();
              }} className="close-btn">
                ×
              </button>
            </div>
            
            <form onSubmit={showAddModal ? handleAddEvent : handleUpdateEvent} className="event-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Event Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="online">Online</option>
                  <option value="physical">Physical</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {(formData.type === 'physical' || formData.type === 'hybrid') && (
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>
              )}

              {(formData.type === 'online' || formData.type === 'hybrid') && (
                <div className="form-group">
                  <label>Meeting Link</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    required
                  />
                </div>
              )}

              <div className="modal-actions">
                {showEventModal && (
                  <button type="button" onClick={handleDeleteEvent} className="delete-btn">
                    Delete
                  </button>
                )}
                <button type="submit" className="submit-btn">
                  {showAddModal ? 'Add Event' : 'Update Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminEvents;
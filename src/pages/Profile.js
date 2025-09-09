import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import Navbar from '../components/Navbar'; // Import the Navbar component
import './Profile.css'; // You'll need to create this CSS file
import AuthService from '../apis/auth';
import ContactService from '../apis/contact';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { refreshUser } = useAuth();
  // Add loading state
  const [loading, setLoading] = useState(false);

  // Replace dummy userData with actual user data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    image: ''
  });

  // Add edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Update the state to track image deletion
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setUserData(user);
      setEditForm(user);
    }
  }, []);

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return name === '' || nameRegex.test(name);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return username === '' || usernameRegex.test(username);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email === '' || emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9+\-\s]*$/;
    return phone === '' || (phoneRegex.test(phone) && phone.replace(/[^0-9]/g, '').length >= 10);
  };

  // State for validation errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: ''
  });

  // Handle edit form changes with validation
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    // Validate the field
    let error = '';
    if (value.trim() !== '') {
      switch (name) {
        case 'firstName':
        case 'lastName':
          if (!validateName(value)) {
            error = 'Name should contain only letters and spaces';
          }
          break;
        case 'username':
          if (!validateUsername(value)) {
            error = 'Username can only contain letters, numbers, and underscores';
          }
          break;
        case 'email':
          if (!validateEmail(value)) {
            error = 'Please enter a valid email address';
          }
          break;
        case 'phone':
          if (!validatePhone(value)) {
            error = 'Please enter a valid phone number (at least 10 digits)';
          }
          break;
        default:
          break;
      }
    }

    // Update errors state
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Update form data if validation passes
    if (!error || name === 'phone') { // Allow typing in phone field but show error
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle image delete
  const handleImageDelete = () => {
    // Clear both states and localStorage
    const updatedUserData = {
      ...userData,
      image: null
    };
    
    setEditForm(prev => ({
      ...prev,
      image: null
    }));
    setUserData(updatedUserData);
    setIsImageDeleted(true);
    
    // Update localStorage immediately
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      // Create update payload
      const updateData = {
        ...editForm,
        // Explicitly set image to null if deleted
        image: isImageDeleted ? null : editForm.image
      };

      const response = await AuthService.updateProfile(updateData);
      
      if (response.data?.user) {
        // Important: Check if the response has the updated user data
        if (isImageDeleted && response.data.user.image) {
          // If backend didn't nullify the image, force it to null
          response.data.user.image = null;
        }
        
        // Update both states with the response data
        setUserData(response.data.user);
        setEditForm(response.data.user);
        setIsEditing(false);
        setIsImageDeleted(false); // Reset the deletion flag
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  // Get default image if user image is not present
  const getProfileImage = () => {
    return userData.image || 'https://via.placeholder.com/150?text=Profile';
  };

  // Dummy contacts data
  const [contacts, setContacts] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [filteredDummyContacts, setFilteredDummyContacts] = useState([]);

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);

  const modalRef = useRef(null);

  // Update or add this state for filtered contacts
  const [filteredContacts, setFilteredContacts] = useState([]);

  // Add this useEffect to load both contacts and contact requests on mount
  useEffect(() => {
    loadContacts();
    loadContactRequests();
  }, []);

  // Update the search handler function
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === '') {
      // If search is empty, show all contacts
      setFilteredContacts(contacts);
    } else {
      // Filter contacts based on search term
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.phone.toLowerCase().includes(term)
      );
      setFilteredContacts(filtered);
    }
  };

  // Handle removing a contact
  const handleRemoveContact = async (contactId) => {
    try {
      const response = await ContactService.removeContact(contactId);
      if (response.success) {
        await loadContacts(); // Reload contacts after removal
        alert('Contact removed successfully');
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Error removing contact:', error);
      alert('Failed to remove contact');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalSearch('');
    setSelectedContacts([]);
    setFilteredDummyContacts([]);
    document.removeEventListener('mousedown', handleClickOutside);
  };

  const handleModalShow = () => {
    setShowModal(true);
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleModalClose();
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add new function to load contact requests
  const loadContactRequests = async () => {
    const response = await ContactService.getContactRequests();
    if (response.success) {
      setUserRequests(response.data);
    } else {
      alert(response.message);
    }
  };

  // Update handleContactRequest to reload requests after approval/rejection
  const handleContactRequest = async (requestUserId, isApproved) => {
    const response = await ContactService.approveUserRequest(requestUserId, isApproved);
    if (response.success) {
      await loadContactRequests(); // Reload requests after processing
      await loadContacts(); // Also reload contacts if request was approved
      alert(`Request ${isApproved ? 'approved' : 'rejected'} successfully!`);
    } else {
      alert(response.message);
    }
  };

  // Update handleModalSearchChange to use ContactService.searchUsers
  const handleModalSearchChange = async (e) => {
    const searchTerm = e.target.value;
    setModalSearch(searchTerm);

    if (searchTerm.trim()) {
      const response = await ContactService.searchUsers(searchTerm);
      if (response.success) {
        setFilteredDummyContacts(response.data);
      } else {
        setFilteredDummyContacts([]);
      }
    } else {
      setFilteredDummyContacts([]);
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.some(c => c._id === contact._id);
      if (isSelected) {
        return prev.filter(c => c._id !== contact._id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleAddContacts = async () => {
    const contactIds = selectedContacts.map(contact => contact._id);
    const response = await ContactService.addContacts(contactIds);

    if (response.success) {
      await loadContacts(); // Reload contacts after adding
      handleModalClose();
      alert('Contacts added successfully!');
    } else {
      alert(response.message);
    }
  };

  // Handle image upload and conversion to base64
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('Image size must be less than 5MB');
        e.target.value = '';
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        setEditForm(prev => ({
          ...prev,
          image: base64
        }));
        setIsImageDeleted(false); // Reset delete flag when new image is uploaded
      } catch (error) {
        toast.error('Error processing image. Please try again.');
        console.error('Image conversion error:', error);
      }
    }
  };

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Add this new function to load contacts
  const loadContacts = async () => {
    const response = await ContactService.getContacts();
    if (response.success) {
      setContacts(response.data);
      setFilteredContacts(response.data);
    } else {
      alert(response.message);
    }
  };

  const handleCancelRequest = async (contactId) => {
    try {
      const response = await ContactService.cancelContactRequest(contactId);
      if (response.success) {
        await loadContacts(); // Reload contacts after cancellation
        alert('Contact request cancelled successfully');
      } else {
        alert(response.message || 'Failed to cancel contact request');
      }
    } catch (error) {
      console.error('Error cancelling contact request:', error);
      alert('Failed to cancel contact request');
    }
  };

  // Save changes handler with validation
  const handleSaveChanges = async () => {
    // Validate all fields before submission
    const newErrors = {};
    
    // Check required fields
    if (!editForm.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!editForm.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!editForm.username?.trim()) newErrors.username = 'Username is required';
    if (!editForm.email?.trim()) newErrors.email = 'Email is required';
    
    // Check field formats
    if (editForm.firstName && !validateName(editForm.firstName)) {
      newErrors.firstName = 'First name should contain only letters and spaces';
    }
    if (editForm.lastName && !validateName(editForm.lastName)) {
      newErrors.lastName = 'Last name should contain only letters and spaces';
    }
    if (editForm.username && !validateUsername(editForm.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    if (editForm.email && !validateEmail(editForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (editForm.phone && !validatePhone(editForm.phone)) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }
    
    // If there are validation errors, don't proceed with submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the form errors before saving');
      return;
    }
    
    try {
      setLoading(true);
      
      const updateData = {
        ...editForm,
        image: isImageDeleted ? null : editForm.image
      };

      const response = await AuthService.updateProfile(updateData);
      
      if (response.data?.user) {
        // Force null image if deleted
        if (isImageDeleted) {
          response.data.user.image = null;
        }
        
        // Update both states and localStorage
        setUserData(response.data.user);
        setEditForm(response.data.user);
        
        // Update localStorage with the new user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Refresh the user context to update navbar
        refreshUser();
        
        setIsEditing(false);
        setIsImageDeleted(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Replace the existing Navbar with the imported component */}
      <Navbar />

      <Container className="profile-container">
        <div className="page-header">
          <h1>User Profile</h1>
        </div>

        {/* User Info Section */}
        <Card className="profile-card">
          <Card.Header className="card-header">
            <h2>User Information</h2>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <div className="profile-image-container position-relative">
                  {!isImageDeleted && (editForm.image || userData.image) ? (
                    <>
                      <img
                        src={editForm.image || userData.image}
                        alt="Profile"
                        className="profile-image"
                      />
                      {isEditing && (
                        <button
                          type="button"
                          onClick={handleImageDelete}
                          className="position-absolute top-0 end-0 btn btn-danger rounded-circle"
                          style={{ width: '24px', height: '24px', padding: '0' }}
                        >
                          ×
                        </button>
                      )}
                    </>
                  ) : (
                    <img
                      src="https://via.placeholder.com/150?text=Profile"
                      // alt="Profile"
                      className="profile-image"
                    />
                  )}
                </div>
              </Col>
              <Col md={8}>
                <div className="user-info">
                  {isEditing ? (
                    // Edit Form
                    <>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Username *</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={editForm.username || ''}
                            onChange={handleEditChange}
                            isInvalid={!!errors.username}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.username}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={editForm.firstName || ''}
                            onChange={handleEditChange}
                            isInvalid={!!errors.firstName}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.firstName}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={editForm.lastName || ''}
                            onChange={handleEditChange}
                            isInvalid={!!errors.lastName}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.lastName}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Email *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={editForm.email || ''}
                            onChange={handleEditChange}
                            isInvalid={!!errors.email}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={editForm.phone || ''}
                            onChange={handleEditChange}
                            isInvalid={!!errors.phone}
                            placeholder="e.g., +1234567890"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phone}
                          </Form.Control.Feedback>
                          <Form.Text className="text-muted">
                            Enter your phone number with country code (optional)
                          </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Bio</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="bio"
                            value={editForm.bio || ''}
                            onChange={handleEditChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Profile Image</Form.Label>
                          <div className="d-flex align-items-center gap-3">
                            <div className="position-relative">
                              <img
                                src={editForm.image || getProfileImage()}
                                alt="Profile Preview"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                              />
                              {editForm.image && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  className="position-absolute top-0 end-0 rounded-circle p-1"
                                  style={{ width: '24px', height: '24px', fontSize: '12px' }}
                                  onClick={() => setEditForm(prev => ({ ...prev, image: null }))}
                                >
                                  ×
                                </Button>
                              )}
                            </div>
                            <Form.Control
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="form-input"
                            />
                          </div>
                          <Form.Text className="text-muted">
                            Upload a new profile image (JPG, PNG, or GIF)
                          </Form.Text>
                        </Form.Group>
                        <div className="d-flex gap-2">
                          <Button
                            variant="success"
                            onClick={handleSaveChanges}
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    </>
                  ) : (
                    // Display Info
                    <>
                      <div className="info-row">
                        <div className="info-label">Username:</div>
                        <div className="info-value">{userData.username}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label">Name:</div>
                        <div className="info-value">{`${userData.firstName || ''} ${userData.lastName || ''}`}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label">Email:</div>
                        <div className="info-value">{userData.email}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label">Phone:</div>
                        <div className="info-value">{userData.phone}</div>
                      </div>
                      <div className="info-row">
                        <div className="info-label">Bio:</div>
                        <div className="info-value">{userData.bio}</div>
                      </div>
                      <Button
                        variant="success"
                        onClick={() => setIsEditing(true)}
                        className="edit-button"
                      >
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Add this new section before the Contacts Section */}
        <Card className="requests-card mb-4">
          <Card.Header className="card-header">
            <h2>Contact Requests</h2>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table className="requests-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userRequests.length > 0 ? (
                    userRequests.map(request => (
                      <tr key={request.id}>
                        <td>{request.name}</td>
                        <td>{request.username}</td>
                        <td>{request.email}</td>
                        <td>
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => handleContactRequest(request._id, true)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleContactRequest(request._id, false)}
                          >
                            Reject
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No pending requests
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Contacts Section */}
        <Card className="contacts-card">
          <Card.Header className="card-header">
            <h2>Contacts</h2>
          </Card.Header>
          <Card.Body>
            {/* Add Contact Button */}
            <div className="add-button-wrapper">
              <Button variant="success" className="add-contact-button" onClick={handleModalShow}>
                Add New Contact
              </Button>
            </div>


            {/* Search Bar */}
            <div className="search-container">
              <Form.Control
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>


            {/* Contacts Table */}
            <div className="table-responsive">
              <Table className="contacts-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date Added</th>
                    <th>Status/Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map(contact => (
                      <tr key={contact._id}>
                        <td>{contact.username}</td>
                        <td>{contact.email}</td>
                        <td>{contact.phone || '-'}</td>
                        <td>{new Date(contact.dateAdded).toLocaleDateString()}</td>
                        <td>
                          {contact.approved ? (
                            <Button
                              variant="danger"
                              size="sm"
                              className="remove-button"
                              onClick={() => handleRemoveContact(contact._id)}
                            >
                              Remove
                            </Button>
                          ) : (
                            <div className="d-flex align-items-center gap-2">
                              <span className="pending-status">Pending Approval</span>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="cancel-request-button"
                                onClick={() => handleCancelRequest(contact._id)}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-contacts">
                        {searchTerm ? 'No matching contacts found' : 'No contacts to display'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {showModal && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal" ref={modalRef}>
            <div className="custom-modal-header">
              <h2>Add New Contacts</h2>
              <button
                className="close-button"
                onClick={handleModalClose}
              >
                &times;
              </button>
            </div>
            <div className="custom-modal-body">
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  value={modalSearch}
                  onChange={handleModalSearchChange}
                  className="modal-search-input"
                  autoFocus
                />
              </div>
              <div className="contact-selection-list">
                {filteredDummyContacts.length > 0 ? (
                  filteredDummyContacts.map(contact => (
                    <div
                      key={contact._id}
                      className="contact-selection-item"
                    >
                      <label
                        className="contact-selection-label"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedContacts.some(c => c._id === contact._id)}
                          onChange={() => handleContactSelect(contact)}
                          className="contact-checkbox"
                        />
                        <div className="contact-info">
                          <div className="contact-name">
                            <strong>{contact.username}</strong>
                          </div>
                          <div className="contact-details">
                            <span>{contact.email}</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    {modalSearch.trim() ? 'No matching users found' : 'Start typing to search for users'}
                  </div>
                )}
              </div>
            </div>
            <div className="custom-modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleAddContacts}
                disabled={selectedContacts.length === 0}
              >
                Add Selected ({selectedContacts.length})
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Profile;
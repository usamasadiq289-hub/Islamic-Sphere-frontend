import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GroupService from '../apis/group';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import './Groups.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
const Groups = () => {

  useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  const [ownedGroups, setOwnedGroups] = useState([]);
  const [memberGroups, setMemberGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    image: '',
    members: []
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [editGroup, setEditGroup] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [isProgressHidden, setIsProgressHidden] = useState(false);
  const [hiddenMembers, setHiddenMembers] = useState(selectedGroup?.hiddenMembers || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('owned'); // 'owned' or 'member'
  const [ownedGroupsSearch, setOwnedGroupsSearch] = useState('');
  const [memberGroupsSearch, setMemberGroupsSearch] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      setHiddenMembers(selectedGroup.hiddenMembers || []);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await GroupService.getUserGroups();
      setOwnedGroups(response.groupsOwned || []);
      setMemberGroups(response.groups || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch groups. Please try again later.');
      console.error('Error fetching groups:', err);
      toast.error(err.message || 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await GroupService.createGroup(newGroup);
      if (response.data) {
        toast.success('Group created successfully!');
        setOwnedGroups([...ownedGroups, response.data]);
        setShowCreateModal(false);
        setNewGroup({ name: '', description: '', image: '', members: [] });
        fetchGroups();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await GroupService.deleteGroup(groupId);
        toast.success('Group deleted successfully');
        fetchGroups();
      } catch (err) {
        toast.error(err.message || 'Failed to delete group');
      }
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to leave this group?')) {
      try {
        await GroupService.groupActions(groupId, 'leaveGroup');
        toast.success('Left group successfully');
        setMemberGroups(memberGroups.filter(group => group._id !== groupId));
        fetchGroups();
      } catch (err) {
        toast.error(err.message || 'Failed to leave group');
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewGroup({ ...newGroup, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const openGroupSettings = async (group) => {
    setSelectedGroup(group);
    setEditGroup({
      name: group.name,
      description: group.description || '',
      image: group.image || ''
    });

    // try {
    //   // Check if user's progress is hidden for this group
    //   const user = await getUserProfile();
    //   setIsProgressHidden(user.hiddenProgress?.includes(group._id) || false);
    // } catch (error) {
    //   console.error('Error checking progress visibility:', error);
    // }

    setShowSettingsModal(true);
  };

  // Filter groups based on search query
  const filteredOwnedGroups = ownedGroups.filter(group =>
    group.name.toLowerCase().includes(ownedGroupsSearch.toLowerCase())
  );

  const filteredMemberGroups = memberGroups.filter(group =>
    group.name.toLowerCase().includes(memberGroupsSearch.toLowerCase())
  );

  const updateGroupDetails = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Create update payload with explicit null/empty for removed image
      const updatePayload = {
        ...editGroup,
        // Set image to null if it was removed
        image: editGroup.image || null
      };

      const response = await GroupService.updateGroupDetails(selectedGroup._id, updatePayload);

      if (response.data) {
        toast.success('Group updated successfully!');
        setShowSettingsModal(false);
        // Update the local state to reflect changes
        setSelectedGroup(prev => ({
          ...prev,
          ...updatePayload
        }));
        await fetchGroups(); // Refresh groups data
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update group');
    } finally {
      setLoading(false);
    }
  };

  const toggleProgressVisibility = async (groupId) => {
    try {
      if (loading) return;
      setLoading(true);

      // Check if user is already in hiddenMembers
      const isCurrentlyHidden = hiddenMembers.includes(user.id);

      // Create new array based on current state
      const newHiddenMembers = isCurrentlyHidden
        ? hiddenMembers.filter(id => id !== user.id) // Remove user
        : [...hiddenMembers, user.id]; // Add user

      const updatePayload = {
        hiddenMembers: newHiddenMembers
      };

      const response = await GroupService.updateGroupDetails(groupId, updatePayload);

      if (response.data) {
        setHiddenMembers(newHiddenMembers);
        toast.success('Privacy settings updated successfully');
        fetchGroups(); // Reload all groups data
      }
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast.error(error.message || 'Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const groupCardHeader = (group) => (
    <div className="group-card-header">
      {group.image ? (
        <img src={group.image} alt={group.name} className="group-image" />
      ) : (
        <div className="group-image-placeholder">
          <i className="fas fa-users"></i>
          <span>{group.name.charAt(0).toUpperCase()}</span>
        </div>
      )}
      <div className="group-settings-menu">
        <button
          className="menu-dots-button"
          onClick={(e) => {
            e.stopPropagation();
            openGroupSettings(group);
          }}
          aria-label="Group settings"
        >
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>
      {user && (
        <div className="group-card-badge">
          {group.owner === user.id ?
            <span className="owner-badge">Owner</span> :
            <span className="member-badge">Member</span>
          }
        </div>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <Navbar />
      <div className="groups-wrapper">
        <div className="groups-container">
       
          <div className="header-section">
            <div className="islamic-elements">
              <div className="islamic-decoration"></div>
              <div className="islamic-star"></div>
              <div className="islamic-crescent"></div>
              <div className="islamic-pattern"></div>
              <div className="islamic-dome"></div>
              <div className="islamic-arch"></div>
            </div>
            <div className="header-content">
              <div className="hero-badge">Islamic Groups</div>
              <h1 className="animated-gradient-heading"><span>Islamic Study Groups</span></h1>
              <p className="header-description">
                Connect with others, <strong>share knowledge</strong>, and grow together in faith
              </p>
              <button
                className="create-group-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="fas fa-plus-circle mr-2"></i>
                Create New Group
              </button>
            </div>
            <div className="hero-scroll-indicator">
              <div className="scroll-arrow"></div>
              <div className="scroll-text">Explore Groups</div>
            </div>
          </div>

          {/* Tabbed Interface */}
          <div className="tabs-container">
            <div className="tabs-header">
              <button
                className={`tab-button ${activeTab === 'owned' ? 'active' : ''}`}
                onClick={() => setActiveTab('owned')}
              >
                <i className="fas fa-crown mr-2"></i>
                My Groups
                <span className="tab-count">{ownedGroups.length}</span>
              </button>
              <button
                className={`tab-button ${activeTab === 'member' ? 'active' : ''}`}
                onClick={() => setActiveTab('member')}
              >
                <i className="fas fa-users mr-2"></i>
                Member Of
                <span className="tab-count">{memberGroups.length}</span>
              </button>
            </div>

            {/* Tab-specific Search Bar */}
            <div className="tab-search-section">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    placeholder={activeTab === 'owned' ? 'Search my groups...' : 'Search member groups...'}
                    value={activeTab === 'owned' ? ownedGroupsSearch : memberGroupsSearch}
                    onChange={(e) => {
                      if (activeTab === 'owned') {
                        setOwnedGroupsSearch(e.target.value);
                      } else {
                        setMemberGroupsSearch(e.target.value);
                      }
                    }}
                    className="search-input"
                  />
                  {((activeTab === 'owned' && ownedGroupsSearch) || (activeTab === 'member' && memberGroupsSearch)) && (
                    <button
                      onClick={() => {
                        if (activeTab === 'owned') {
                          setOwnedGroupsSearch('');
                        } else {
                          setMemberGroupsSearch('');
                        }
                      }}
                      className="clear-search-btn"
                      aria-label="Clear search"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="content-wrapper">
            {loading && !ownedGroups.length && !memberGroups.length ? (
              <div className="loading-section">
                <div className="loader"></div>
                <p>Loading groups...</p>
              </div>
            ) : error ? (
              <div className="error-section">
                <p>{error}</p>
              </div>
            ) : (
              <div className="groups-content">
              {activeTab === 'owned' ? (
                <section className="owned-groups">
                  <h2>Groups I Own</h2>
                  {filteredOwnedGroups.length === 0 ? (
                    ownedGroupsSearch ? (
                      <p>No owned groups found matching "{ownedGroupsSearch}".</p>
                    ) : (
                      <p>You don't own any groups yet.</p>
                    )
                  ) : (
                    <div className="groups-grid">
                      {filteredOwnedGroups.map(group => (
                        <div key={group._id} className="group-card">
                          {groupCardHeader(group)}
                          <div className="group-content">
                            <h3>{group.name}</h3>
                            <p>{group.description}</p>
                            <div className="stats-container">
                              <div className="stat-item">
                                <span className="stat-label">Tasks:</span>
                                <span className="stat-value">{`${group.tasks?.filter(task => task.isCompleted).length}/${group.tasks?.length || 0}`}</span>
                              </div>
                              <div className="stat-item">
                                <span className="stat-label">Polls:</span>
                                <span className="stat-value">{group.polls?.length || 0}</span>
                              </div>
                              <div className="stat-item">
                                <span className="stat-label">Members:</span>
                                <span className="stat-value">{group.members?.length || 0}</span>
                              </div>
                            </div>
                            <div className="button-container">
                              <button onClick={() => navigate(`/groups/${group._id}`)} className="view-button" data-hover="View">
                                <span>View Group</span>
                              </button>
                              <button onClick={() => handleDeleteGroup(group._id)} className="delete-button" data-hover="Delete">
                                <span>Delete Group</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ) : (
                <section className="member-groups">
                  <h2>Groups I'm In</h2>
                  {filteredMemberGroups.length === 0 ? (
                    memberGroupsSearch ? (
                      <p>No member groups found matching "{memberGroupsSearch}".</p>
                    ) : (
                      <p>You're not a member of any groups yet.</p>
                    )
                  ) : (
                    <div className="groups-grid">
                      {filteredMemberGroups.map(group => (
                        <div key={group._id} className="group-card">
                          {groupCardHeader(group)}
                          <div className="group-content">
                            <h3>{group.name}</h3>
                            <p>{group.description}</p>
                            <div className="stats-container">
                              <div className="stat-item">
                                <span className="stat-label">Tasks:</span>
                                <span className="stat-value">{`${group.tasks?.filter(task => task.isCompleted).length}/${group.tasks?.length || 0}`}</span>
                              </div>
                              <div className="stat-item">
                                <span className="stat-label">Polls:</span>
                                <span className="stat-value">{group.polls?.length || 0}</span>
                              </div>
                              <div className="stat-item">
                                <span className="stat-label">Members:</span>
                                <span className="stat-value">{group.members?.length || 0}</span>
                              </div>
                            </div>
                            <div className="button-container">
                              <button onClick={() => navigate(`/groups/${group._id}`)} className="view-button" data-hover="View">
                                <span>View Group</span>
                              </button>
                              <button onClick={() => handleLeaveGroup(group._id)} data-hover="Leave">
                                <span>Leave Group</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-[600px] mb-32 shadow-lg">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-primary-500 border-b border-gray-200 pb-4 mb-6">
                Create New Group
              </h2>
              <form onSubmit={handleCreateGroup} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Group Name
                  </label>
                  <input
                    type="text"
                    placeholder="Group Name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition duration-150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Description"
                    value={newGroup.description}
                    required
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition duration-150"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Group Image
                  </label>
                  <p className="text-xs text-gray-500 mb-3 bg-blue-50 p-2 rounded-md border-l-4 border-blue-400">
                    <i className="fas fa-info-circle text-blue-500 mr-1"></i>
                    <strong>Image Guidelines:</strong> Upload a clear, appropriate image that represents your group. 
                    Recommended size: 400x400px or larger. Maximum file size: 5MB. 
                    Supported formats: JPG, PNG, GIF.
                  </p>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="group-image-upload"
                    />
                    <label
                      htmlFor="group-image-upload"
                      className="cursor-pointer"
                    >
                      {imagePreview ? (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-[160px] rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setImagePreview(null);
                              setNewGroup({ ...newGroup, image: '' });
                            }}
                            className="absolute top-2 right-2 bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-primary-600 transition duration-150"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                          <i className="fas fa-image text-3xl mb-2"></i>
                          <span className="text-sm">Click to upload image</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Add Members
                  </label>
                  <input
                    type="text"
                    placeholder="Add members (comma-separated emails)"
                    onChange={(e) => setNewGroup({
                      ...newGroup,
                      members: e.target.value.split(',').map(email => email.trim())
                    })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition duration-150"
                  />
                </div> */}

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setImagePreview(null);
                      setNewGroup({ name: '', description: '', image: '', members: [] });
                    }}
                    className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition duration-150 text-sm font-medium"
                  >
                    {loading ? 'Creating...' : 'Create Group'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-[1200px] mb-32 shadow-lg">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#055160] border-b border-gray-200 pb-4 mb-6">
                Group Settings
              </h2>

              <form onSubmit={updateGroupDetails} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="col-span-2 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Group Name
                      </label>
                      <input
                        type="text"
                        value={editGroup.name}
                        onChange={(e) => setEditGroup({ ...editGroup, name: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition duration-150"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editGroup.description || ""}
                        onChange={(e) => setEditGroup({ ...editGroup, description: e.target.value })}
                        required
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition duration-150"
                      />
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Group Image
                    </label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                      {editGroup.image ? (
                        <div className="relative">
                          <img
                            src={editGroup.image}
                            alt="Preview"
                            className="max-h-[160px] mx-auto rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setEditGroup({ ...editGroup, image: '' })}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition duration-150"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-400">
                          <i className="fas fa-image text-3xl mb-2"></i>
                          <p className="text-sm">No image selected</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 5242880) {
                              toast.error('Image size should be less than 5MB');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditGroup({ ...editGroup, image: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="edit-group-image"
                      />
                      <label
                        htmlFor="edit-group-image"
                        className="mt-4 inline-block px-4 py-2 bg-primary-50 text-primary-500 rounded-lg cursor-pointer hover:bg-primary-100 transition duration-150 text-sm font-medium"
                      >
                        {editGroup.image ? 'Change Image' : 'Upload Image'}
                      </label>
                    </div>
                  </div>
                </div>

                {/* <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => toggleProgressVisibility(selectedGroup._id)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition duration-150 ${hiddenMembers.includes(user.id)
                        ? 'bg-primary-50 text-primary-500 hover:bg-primary-100'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                        }`}
                    >
                      {hiddenMembers.includes(user.id) ? 'Show My Progress' : 'Hide My Progress'}
                    </button>
                    <p className="text-sm text-gray-500">
                      {hiddenMembers.includes(user.id)
                        ? "Your progress is currently hidden from other members"
                        : "Other members can see your task completion status"}
                    </p>
                  </div>
                </div> */}

                {/* {selectedGroup.owner === user.id && (
                  <div className="bg-red-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
                    <button
                      type="button"
                      onClick={() => handleDeleteGroup(selectedGroup._id)}
                      className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150 text-sm font-medium"
                    >
                      Delete Group
                    </button>
                  </div>
                )} */}

                <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition duration-150 text-sm font-medium"
                  >
                    {loading ? 'Updating...' : 'Update Group'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CTA Footer Section */}

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

export default Groups;
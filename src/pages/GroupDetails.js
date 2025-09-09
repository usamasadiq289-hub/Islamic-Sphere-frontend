import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import GroupService from '../apis/group';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ContactService from '../apis/contact';
import { Button } from 'react-bootstrap';
import AddTaskModal from './AddTaskModal';
import BuiltInTaskModal from './BuiltInTaskModal';
import TasksList from './TasksList';
import PollsList from './PollsList';
import GroupChat from './GroupChat';
import axios from 'axios';

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [polls, setPolls] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showNewPollModal, setShowNewPollModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '' });
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    deadline: ''
  });
  const [builtInTasks, setBuiltInTasks] = useState([
    {
      id: 1,
      title: "Daily Quran Reading",
      description: "Read at least one page of Quran daily",
      category: "Quran",
      isBuiltIn: true
    },
    {
      id: 2,
      title: "Daily Dhikr",
      description: "Perform morning and evening dhikr",
      category: "Dhikr",
      isBuiltIn: true
    },
    {
      id: 3,
      title: "Weekly Hadith Discussion",
      description: "Read and discuss one hadith per week",
      category: "Hadith",
      isBuiltIn: true
    },
    {
      id: 4,
      title: "Tafsir Study",
      description: "Study Quranic commentary and interpretation",
      category: "Quran",
      isBuiltIn: true
    },
    {
      id: 5,
      title: "Memorize Surah",
      description: "Memorize a new surah or portion of the Quran",
      category: "Quran",
      isBuiltIn: true
    },
    {
      id: 6,
      title: "Islamic History",
      description: "Learn about important events in Islamic history",
      category: "History",
      isBuiltIn: true
    },
    {
      id: 7,
      title: "Tahajjud Prayer",
      description: "Establish the night prayer regularly",
      category: "Prayer",
      isBuiltIn: true
    },
    {
      id: 8,
      title: "Daily Dua Practice",
      description: "Learn and practice new duas for different situations",
      category: "Dua",
      isBuiltIn: true
    },
    {
      id: 9,
      title: "Seerah Study",
      description: "Study the life and character of Prophet Muhammad (PBUH)",
      category: "Seerah",
      isBuiltIn: true
    },
    {
      id: 10,
      title: "Fiqh Discussions",
      description: "Learn about Islamic jurisprudence and rulings",
      category: "Fiqh",
      isBuiltIn: true
    },
    {
      id: 11,
      title: "Islamic Ethics",
      description: "Study and implement Islamic ethics and character development",
      category: "Ethics",
      isBuiltIn: true
    },
    {
      id: 12,
      title: "Daily Salawat",
      description: "Send blessings upon the Prophet Muhammad (PBUH) daily",
      category: "Dhikr",
      isBuiltIn: true
    },
    {
      id: 13,
      title: "Charity Tracker",
      description: "Track regular charitable giving and acts of kindness",
      category: "Charity",
      isBuiltIn: true
    },
    {
      id: 14,
      title: "Tajweed Practice",
      description: "Improve Quranic recitation with proper rules of tajweed",
      category: "Quran",
      isBuiltIn: true
    },
    {
      id: 15,
      title: "Islamic Book Club",
      description: "Read and discuss Islamic books with group members",
      category: "Education",
      isBuiltIn: true
    },
    {
      id: 16,
      title: "Weekly Reflection",
      description: "Reflect on personal spiritual growth and set improvement goals",
      category: "Self-development",
      isBuiltIn: true
    },
    {
      id: 17,
      title: "Arabic Language Study",
      description: "Learn basic Arabic vocabulary and grammar for Quran understanding",
      category: "Language",
      isBuiltIn: true
    },
    {
      id: 18,
      title: "Sunnah Practices",
      description: "Implement the daily Sunnah practices of the Prophet (PBUH)",
      category: "Sunnah",
      isBuiltIn: true
    },
    {
      id: 19,
      title: "Quranic Vocabulary",
      description: "Learn and review common words used in the Quran",
      category: "Quran",
      isBuiltIn: true
    },
    {
      id: 20,
      title: "Community Service",
      description: "Organize or participate in community service activities",
      category: "Community",
      isBuiltIn: true
    }
  ]);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [userContacts, setUserContacts] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isProgressHidden, setIsProgressHidden] = useState(false);
  const modalRef = useRef(null);
  const [showTaskMembersModal, setShowTaskMembersModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showPollVotesModal, setShowPollVotesModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showBuiltInTaskModal, setShowBuiltInTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuiltInTask, setSelectedBuiltInTask] = useState(null);
  const [builtInTaskDeadline, setBuiltInTaskDeadline] = useState('');

  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);

  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      const response = await GroupService.getGroupDetails(groupId);
      console.log(response);
      if (response.data) {
        setGroup(response.data.group);
        setTasks(response.data.tasks);
        setPolls(response.data.polls);

        // Set progress visibility state
        if (response.data.userPreferences) {
          setIsProgressHidden(response.data.userPreferences.isProgressHidden);
        }
      }
    } catch (error) {
      toast.error('Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await GroupService.addTask(groupId, taskData);
      toast.success('Task created successfully');
      await loadGroupDetails(); // Reload group details
      setShowAddTaskModal(false);
      setNewTask({ title: '', description: '', deadline: '' });
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    try {
      const pollData = {
        title: newPoll.question,
        options: newPoll.options.map(opt => opt),
        deadline: newPoll.deadline
      };

      const response = await GroupService.addPoll(groupId, pollData);
      if (response.data) {
        toast.success('Poll created successfully');
        await loadGroupDetails(); // Reload group details
        setShowNewPollModal(false);
        setNewPoll({
          question: '',
          options: ['', ''],
          deadline: ''
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create poll');
    }
  };

  const addPollOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removePollOption = (index) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const handleTaskCompletion = async (taskId) => {
    try {
      setLoading(true);

      // Find current task to check if it's already completed by the user
      const task = tasks.find(t => t._id === taskId);
      const isCurrentlyCompleted = task.usersCompleted?.some(uid =>
        uid === user.id || (uid._id && uid._id === user.id)
      );

      // Determine the action based on current completion status
      const action = isCurrentlyCompleted ? 'uncomplete' : 'complete';

      const response = await GroupService.taskActions(groupId, taskId, action);
      if (response.data) {
        toast.success(`Task ${isCurrentlyCompleted ? 'marked as incomplete' : 'completed'} successfully`);
        await loadGroupDetails(); // Reload group details
      }
    } catch (error) {
      toast.error('Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      setLoading(true);
      console.log('Voting on poll:', pollId, 'option:', optionId); // Debugging

      await GroupService.votePoll(groupId, pollId, optionId);
      toast.success('Vote recorded successfully');

      // Reload to get the updated poll data
      await loadGroupDetails();
    } catch (error) {
      toast.error('Failed to record vote');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBuiltInTask = (task) => {
    setSelectedBuiltInTask(task);
  };

  const submitBuiltInTask = () => {
    if (!builtInTaskDeadline) {
      toast.error('Please select a deadline');
      return;
    }

    GroupService.addTask(groupId, { 
      ...selectedBuiltInTask, 
      deadline: builtInTaskDeadline,
      isBuiltIn: true 
    })
      .then(response => {
        toast.success('Built-in task added successfully!');
        loadGroupDetails();
        setSelectedBuiltInTask(null);
        setBuiltInTaskDeadline('');
        setShowBuiltInTaskModal(false);
      })
      .catch(error => {
        console.error('Error adding built-in task:', error);
        toast.error('Failed to add built-in task: ' + (error.message || 'Server error'));
      });
  };

  const loadUserContacts = async () => {
    try {
      const response = await ContactService.getContacts();
      if (response.data) {
        // Filter out contacts that are already members
        const existingMemberIds = group?.members?.map(member => member._id) || [];
        const availableContacts = response.data.filter(
          contact => !existingMemberIds.includes(contact._id) && contact.approved
        );
        setUserContacts(availableContacts);

        if (availableContacts.length === 0) {
          toast.info('No contacts available to add. Add some contacts first!');
        }
      } else {
        toast.error(response.message || 'Failed to load contacts');
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error(error.response?.data?.message || 'Failed to load contacts');
    }
  };

  const handleMemberSelect = (contact) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m._id === contact._id);
      if (isSelected) {
        return prev.filter(m => m._id !== contact._id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleAddGroupMembers = async (e) => {
    if (e) e.preventDefault();

    try {
      setLoading(true);

      // Validate input
      if (selectedMembers.length === 0) {
        toast.warning('Please select at least one contact to add');
        setLoading(false);
        return;
      }

      // Use the existing groupActions method from GroupService
      const response = await GroupService.groupActions(
        groupId,
        'addMembers',
        { members: selectedMembers.map(member => member._id) }
      );

      if (response && response.error === null) {
        toast.success('Members added successfully');
        await loadGroupDetails(); // Reload group details
        setShowAddMembersModal(false);
        setSelectedMembers([]);
      } else {
        console.error('Server returned error:', response);
        toast.error(response?.message || 'Failed to add members');
      }
    } catch (error) {
      console.error('Error adding members:', error);

      if (typeof error === 'object' && error !== null) {
        toast.error(error.message || 'Failed to add members');
      } else {
        toast.error('Failed to add members');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showAddMembersModal) {
      loadUserContacts();
    }
  }, [showAddMembersModal]);

  const viewTaskMembers = (task) => {
    setSelectedTask(task);
    setShowTaskMembersModal(true);
  };

  const calculateProgress = (task) => {
    if (!task || !task.usersCompleted || !group || !group.members) return 0;

    const completedCount = task.usersCompleted.length;
    const totalMembers = group.members.length;

    if (totalMembers === 0) return 0;
    return (completedCount / totalMembers) * 100;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setLoading(true);
      await GroupService.deleteTask(groupId, taskId);
      toast.success('Task deleted successfully');
      await loadGroupDetails(); // Reload group details
    } catch (error) {
      toast.error('Failed to delete task');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

 const handleDeletePoll = async (pollId) => {
  if (!window.confirm('Are you sure you want to delete this poll?')) {
    return;
  }

  try {
    setLoading(true);
    await GroupService.deletePoll(groupId, pollId);
    toast.success('Poll deleted successfully');
    await loadGroupDetails(); // Reload group details
  } catch (error) {
    toast.error('Failed to delete poll');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const userVoted = (poll) => {
    if (!poll || !poll.options || !user || !user.id) return false;

    // Check if the user has voted on any option in this poll
    return poll.options.some(option =>
      option.votes && option.votes.some(vote =>
        vote === user.id || (vote._id && vote._id === user.id)
      )
    );
  };

  const calculateVotePercentage = (poll, option) => {
    if (!poll || !poll.options || !option || !option.votes) return 0;

    // Calculate total votes across all options
    const totalVotes = poll.options.reduce((sum, opt) =>
      sum + (opt.votes ? opt.votes.length : 0), 0);

    if (totalVotes === 0) return 0;

    // Calculate percentage for this option
    return (option.votes.length / totalVotes) * 100;
  };

  const pollHasUserVote = (poll) => {
    if (!user || !poll || !poll.options) return false;

    const userId = user.id;
    return poll.options.some(option =>
      option.votes && option.votes.some(vote =>
        vote === userId || (vote._id && vote._id === userId)
      )
    );
  };

  const openPollVotesModal = (poll) => {
    setSelectedPoll(poll);
    setShowPollVotesModal(true);
  };

  // Create a standardized action button component for both tasks and polls
  const ActionButton = ({ icon, label, onClick, variant = 'primary' }) => (
    <button
      className={`action-btn ${variant}`}
      onClick={onClick}
      title={label}
    >
      <i className={`fas ${icon}`}></i>
      {label && <span>{label}</span>}
    </button>
  );

  // Add this function near your other helper functions
  const isTaskCompleted = (task) => {
    if (!user || !task || !task.usersCompleted) return false;

    const userId = user.id;
    return task.usersCompleted.some(completedUser =>
      completedUser === userId ||
      (completedUser._id && completedUser._id === userId)
    );
  };

  // Separate handlers for each type of task
  const openAddTaskModal = () => {
    console.log('Opening custom task modal');
    setShowAddTaskModal(true);
    setShowBuiltInTaskModal(false); // Ensure the other modal is closed
  };

  const openBuiltInTaskModal = () => {
    console.log('Opening built-in task modal');
    setShowBuiltInTaskModal(true);
    setShowAddTaskModal(false); // Ensure the other modal is closed
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member from the group?')) {
      return;
    }

    try {
      setLoading(true);

      // Create updated members list without the removed member
      const updatedMemberIds = group.members
        .filter(member => member._id !== memberId)
        .map(member => member._id);

      // Call API to update group's member list
      const response = await GroupService.updateGroupDetails(groupId, {
        members: updatedMemberIds
      });

      if (response.data) {
        toast.success('Member removed successfully');
        await loadGroupDetails(); // Reload group details
      } else {
        toast.error(response.message || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error(error.response?.data?.message || 'Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  // Complete rewrite of the handleSearchChange function
  const handleSearchChange = (e) => {
    // Safeguard input value
    if (!e || !e.target) {
      console.error('Invalid event object in handleSearchChange');
      return;
    }

    const searchText = String(e.target.value || '').toLowerCase();
    setSearchTerm(searchText);

    // Safeguard userContacts
    if (!Array.isArray(userContacts)) {
      console.error('userContacts is not an array:', userContacts);
      setFilteredContacts([]);
      return;
    }

    if (searchText.trim() === '') {
      setFilteredContacts(userContacts);
      return;
    }

    // Create a safe version of the filter function
    const safeFilteredContacts = userContacts.filter(contact => {
      if (!contact) return false;

      // Safe string properties access
      const safeToString = (val) => {
        if (val === null || val === undefined) return '';
        return String(val).toLowerCase();
      };

      const username = safeToString(contact.username);
      const email = safeToString(contact.email);
      const firstName = safeToString(contact.firstName);
      const lastName = safeToString(contact.lastName);

      return username.includes(searchText) ||
        email.includes(searchText) ||
        firstName.includes(searchText) ||
        lastName.includes(searchText);
    });

    setFilteredContacts(safeFilteredContacts);
  };

  if (!user || !user.id) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }


  const isDuplicateOption = (options, newValue, currentIndex) => {
    return options.some((option, index) => 
      index !== currentIndex && 
      option.toLowerCase().trim() === newValue.toLowerCase().trim()
    );
  };



  return (
    <div className="min-h-screen bg-primary-600">
      <Navbar />
      <div className="pt-16 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : group ? (
          <div className="py-8 flex gap-8">
            {/* Left Sidebar */}
            <div className="w-80 flex-shrink-0 space-y-8">
              {/* Group Info Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border-2 border-primary-100">
                <div className="space-y-4">
                  <h1 className="text-2xl font-extrabold text-gray-900">{group.name}</h1>
                  {group.description && (
                    <p className="text-gray-700 text-sm font-medium">{group.description}</p>
                  )}
                </div>
              </div>

              {/* Members List Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border-2 border-primary-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Members</h2>
                  {group && user && group.owner === user.id && (
                    <button
                      onClick={() => setShowAddMembersModal(true)}
                      className="text-primary-600 hover:bg-primary-50 p-2.5 rounded-lg text-sm font-bold border-2 border-primary-200 hover:border-primary-300"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {group.members?.map(member => (
                    <div key={member._id} className="flex items-center space-x-3 p-3 hover:bg-primary-50 rounded-lg border border-primary-100 hover:border-primary-200 transition duration-150">
                      <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {getInitials(member.firstName || member.username)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900">
                          {member.firstName ? `${member.firstName} ${member.lastName || ''}` : member.username}
                        </div>
                        {member._id === group.owner && (
                          <div className="text-xs font-bold text-primary-600">Owner</div>
                        )}
                        {group.owner === user.id && member._id !== user.id && (
                          <button
                            onClick={() => handleRemoveMember(member._id)}
                            className="text-red-600 hover:text-red-700"
                            title="Remove member"
                          >
                            <i className="fas fa-user-minus"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Tabs Container */}
              <div className="bg-white rounded-xl shadow-md border-2 border-primary-100">
                {/* Tab Headers */}
                <div className="flex border-b border-primary-100">
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`flex-1 py-4 text-center font-bold text-sm transition-colors duration-150 ${activeTab === 'tasks'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-primary-600'
                      }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab('polls')}
                    className={`flex-1 py-4 text-center font-bold text-sm transition-colors duration-150 ${activeTab === 'polls'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-primary-600'
                      }`}
                  >
                    Polls
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-4 text-center font-bold text-sm transition-colors duration-150 ${activeTab === 'chat'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-primary-600'
                      }`}
                  >
                    Chat
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'tasks' ? (
                    <div className="space-y-6">
                      {/* Task Actions - ONLY VISIBLE TO GROUP OWNER */}
                      {user && group && group.owner === user.id && (
                        <div className="flex flex-wrap gap-4 mb-6">
                          <button
                            onClick={() => setShowAddTaskModal(true)}
                            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 text-sm font-medium shadow-sm"
                          >
                            <i className="fas fa-plus mr-2"></i> Create Task
                          </button>
                          <button
                            onClick={() => setShowBuiltInTaskModal(true)}
                            className="flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition duration-150 text-sm font-medium shadow-sm border border-primary-200"
                          >
                            <i className="fas fa-tasks mr-2"></i> Add Built-in Tasks
                          </button>
                        </div>
                      )}

                      {/* Tasks List */}
                      <div className="space-y-4">
                        {(() => {
                          // Filter out expired tasks
                          const activeTasks = tasks.filter(task => new Date(task.deadline) > new Date());
                          
                          if (activeTasks.length === 0) {
                            return (
                              <div className="text-center py-8">
                                <p className="text-gray-500">No active tasks available.</p>
                                {user && group && group.owner === user.id && (
                                  <button
                                    onClick={() => setShowAddTaskModal(true)}
                                    className="mt-4 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition duration-150 text-sm font-medium"
                                  >
                                    <i className="fas fa-plus mr-2"></i> Add New Task
                                  </button>
                                )}
                              </div>
                            );
                          }
                          
                          return (
                            <TasksList
                              tasks={activeTasks}
                              group={group}
                              user={user || {}}
                              onTaskComplete={handleTaskCompletion}
                              onTaskDelete={handleDeleteTask}
                              onViewProgress={viewTaskMembers}
                              calculateProgress={calculateProgress}
                            />
                          );
                        })()}
                      </div>
                    </div>
                  ) : activeTab === 'polls' ? (
                    <div className="space-y-6">
                      {/* Poll Actions - ONLY VISIBLE TO GROUP OWNER */}
                      {user && group && group.owner === user.id && (
                        <div className="flex flex-wrap gap-4 mb-6">
                          <button
                            onClick={() => setShowNewPollModal(true)}
                            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 text-sm font-medium shadow-sm"
                          >
                            <i className="fas fa-plus mr-2"></i> Create Poll
                          </button>
                        </div>
                      )}

                      {/* Polls List */}
                      <div className="space-y-4">
                        {(() => {
                          // Filter out expired polls
                          const activePolls = polls.filter(poll => new Date(poll.deadline) > new Date());
                          
                          if (activePolls.length === 0) {
                            return (
                              <div className="text-center py-8">
                                <p className="text-gray-500">No active polls available.</p>
                                {user && group && group.owner === user.id && (
                                  <button
                                    onClick={() => setShowNewPollModal(true)}
                                    className="mt-4 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition duration-150 text-sm font-medium"
                                  >
                                    <i className="fas fa-plus mr-2"></i> Create New Poll
                                  </button>
                                )}
                              </div>
                            );
                          }
                          
                          return (
                            <PollsList
                              polls={activePolls}
                              user={user || {}}
                              onVote={handleVote}
                              onDelete={handleDeletePoll}
                              onViewResults={openPollVotesModal}
                              group={group}
                              userVoted={userVoted}
                            />
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <GroupChat
  apiKey={"szew68z5xj78"}
  userId={user.id}
  userName={user.firstName || user.username || user.email}
  groupId={groupId}
  groupName={group.name}
  memberIds={group.members.map(member => member._id)}
/>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-red-600 font-bold">Failed to load group details</p>
          </div>
        )}
      </div>

      {/* Add Members Modal */}
      {showAddMembersModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-[600px] mb-32 shadow-lg border-2 border-primary-100">
            <div className="p-8">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Members</h2>
                <button
                  onClick={() => {
                    setShowAddMembersModal(false);
                    setSelectedMembers([]);
                  }}
                  className="text-gray-400 hover:text-gray-500 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {userContacts.length > 0 ? (
                  <div className="space-y-3">
                    {userContacts.map(contact => (
                      <div
                        key={contact._id}
                        className="flex items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition duration-150"
                      >
                        <label className="flex items-center space-x-3 w-full cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedMembers.some(m => m._id === contact._id)}
                            onChange={() => handleMemberSelect(contact)}
                            className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500"
                          />
                          <div>
                            <div className="font-bold text-gray-900">{contact.username}</div>
                            <div className="text-sm text-gray-500">{contact.email}</div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No contacts available to add
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => {
                    setShowAddMembersModal(false);
                    setSelectedMembers([]);
                  }}
                  className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGroupMembers}
                  disabled={selectedMembers.length === 0}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 text-sm font-medium"
                >
                  Add Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-[600px] mb-32 shadow-lg border-2 border-primary-100">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">
                Create New Task
              </h2>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateTask(newTask);
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    min={new Date().toISOString().split('.')[0].slice(0, -3)}
                    value={newTask.deadline}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const now = new Date();
                      if (selectedDate < now) {
                        toast.error('Cannot set deadline in the past');
                        return;
                      }
                      setNewTask({ ...newTask, deadline: e.target.value });
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 text-sm font-medium"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

     {/* Built-in Task Modal */}
{showBuiltInTaskModal && (
  <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
    <div className="bg-white rounded-xl w-[90%] max-w-[600px] mb-32 shadow-lg border-2 border-primary-100">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">
          Add Built-in Task
        </h2>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {builtInTasks.map(task => (
            <div
              key={task.id}
              className={`p-4 border-2 ${
                selectedBuiltInTask?.id === task.id 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
              } rounded-lg transition duration-150`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
                {selectedBuiltInTask?.id === task.id ? (
                  <div className="ml-4 flex items-center space-x-2">
                    <input
                      type="datetime-local"
                      min={new Date().toISOString().split('.')[0].slice(0, -3)}
                      value={builtInTaskDeadline}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        const now = new Date();
                        if (selectedDate < now) {
                          toast.error('Cannot set deadline in the past');
                          return;
                        }
                        setBuiltInTaskDeadline(e.target.value);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (!builtInTaskDeadline) {
                          toast.error('Please set a deadline');
                          return;
                        }
                        const deadlineDate = new Date(builtInTaskDeadline);
                        const now = new Date();
                        if (deadlineDate < now) {
                          toast.error('Cannot set deadline in the past');
                          return;
                        }
                        submitBuiltInTask();
                      }}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                    >
                      Add Task
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddBuiltInTask(task)}
                    className="px-4 py-2 text-primary-600 hover:bg-primary-100 rounded-lg text-sm font-medium"
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={() => {
              setShowBuiltInTaskModal(false);
              setSelectedBuiltInTask(null);
              setBuiltInTaskDeadline('');
            }}
            className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      {/* Create Poll Modal */}
      {showNewPollModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-[600px] mb-32 shadow-lg border-2 border-primary-100">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">
                Create New Poll
              </h2>

              <form onSubmit={(e) => {
                e.preventDefault();
                // Validate deadline
                const deadlineDate = new Date(newPoll.deadline);
                const now = new Date();
                if (deadlineDate < now) {
                  toast.error('Cannot set deadline in the past');
                  return;
                }
                handleCreatePoll(e);
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={newPoll.question}
                    onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                    required
                  />
                </div>


                



 {/* Update the options input handling */}
<div className="space-y-3">
  <label className="block text-sm font-bold text-gray-700 mb-2">
    Options
  </label>
  {newPoll.options.map((option, index) => (
    <div key={index} className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={option}
          onChange={(e) => {
            const newValue = e.target.value;
            if (isDuplicateOption(newPoll.options, newValue, index)) {
              toast.error('This option already exists');
              return;
            }
            const newOptions = [...newPoll.options];
            newOptions[index] = newValue;
            setNewPoll({ ...newPoll, options: newOptions });
          }}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
          placeholder={`Option ${index + 1}`}
          required
        />
      </div>
      {index > 1 && (
        <button
          type="button"
          onClick={() => removePollOption(index)}
          className="p-2 text-gray-400 hover:text-gray-500"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  ))}
  <button
    type="button"
    onClick={addPollOption}
    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
  >
    + Add Option
  </button>
</div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    min={new Date().toISOString().split('.')[0].slice(0, -3)}
                    value={newPoll.deadline}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const now = new Date();
                      if (selectedDate < now) {
                        toast.error('Cannot set deadline in the past');
                        return;
                      }
                      setNewPoll({ ...newPoll, deadline: e.target.value });
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
                    required
                  />
                </div>


                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowNewPollModal(false)}
                    className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 text-sm font-medium"
                  >
                    Create Poll
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Task Progress Modal */}
      {showTaskMembersModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-[600px] mb-32 shadow-lg border-2 border-primary-100">
            <div className="p-8">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Task Progress</h2>
                <button
                  onClick={() => setShowTaskMembersModal(false)}
                  className="text-gray-400 hover:text-gray-500 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{selectedTask.title}</h3>
                <p className="text-gray-600 mb-3">{selectedTask.description}</p>

                {/* Deadline */}
                <div className="flex items-center text-sm font-medium mb-4">
                  <i className="far fa-clock text-primary-600 mr-2"></i>
                  <span className={`${new Date(selectedTask.deadline) < new Date() ? 'text-red-600' : 'text-gray-600'
                    }`}>
                    Deadline: {new Date(selectedTask.deadline).toLocaleString()}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="relative h-3 bg-primary-100 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-primary-600 transition-all duration-300"
                      style={{ width: `${calculateProgress(selectedTask)}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm font-bold text-primary-600 text-right">
                    {selectedTask.usersCompleted?.length || 0} of {group.members?.length || 0} completed
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Member Status</h3>

                {/* Members List - Only shows visible members */}
                <div className="max-h-[300px] overflow-y-auto space-y-3">
                  {group.members
                    .filter(member =>
                      !selectedTask.hiddenMembers?.includes(member._id) &&
                      !group.hiddenMembers?.includes(member._id)
                    )
                    .map(member => {
                      const hasCompleted = selectedTask.usersCompleted?.some(
                        userId => userId === member._id || (userId._id && userId._id === member._id)
                      );

                      return (
                        <div
                          key={member._id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary-200 transition duration-150"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                              {getInitials(member.firstName || member.username)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">
                                {member.firstName ? `${member.firstName} ${member.lastName || ''}` : member.username}
                                {member._id === user.id && " (You)"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {hasCompleted ? 'Completed' : 'Not completed'}
                              </div>
                            </div>
                          </div>

                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${hasCompleted
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {hasCompleted ? '✓ Done' : 'Pending'}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowTaskMembersModal(false)}
                  className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Poll Results Modal */}
      {showPollVotesModal && selectedPoll && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-[90%] max-w-[600px] mb-32 shadow-lg border-2 border-primary-100">
            <div className="p-8">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Poll Votes</h2>
                <button
                  onClick={() => setShowPollVotesModal(false)}
                  className="text-gray-400 hover:text-gray-500 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{selectedPoll.title}</h3>

                {/* Deadline */}
                <div className="flex items-center text-sm font-medium mb-4">
                  <i className="far fa-clock text-primary-600 mr-2"></i>
                  <span className={`${new Date(selectedPoll.deadline) < new Date() ? 'text-red-600' : 'text-gray-600'
                    }`}>
                    Deadline: {new Date(selectedPoll.deadline).toLocaleString()}
                    {new Date(selectedPoll.deadline) < new Date()}
                  </span>
                </div>

                {/* Overall Progress Bar */}
                <div className="mt-4">
                  <div className="relative h-3 bg-primary-100 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-primary-600 transition-all duration-300"
                      style={{
                        width: `${(selectedPoll.options.reduce((acc, opt) =>
                          acc + (opt.votes?.length || 0), 0) / group.members.length) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm font-bold text-primary-600 text-right">
                    {selectedPoll.options.reduce((acc, opt) => acc + (opt.votes?.length || 0), 0)} of {group.members.length} voted
                  </div>
                </div>
              </div>

              {/* Options with Progress */}
              <div className="space-y-6 mb-8">
                {selectedPoll.options.map(option => {
                  const voteCount = option.votes?.length || 0;
                  const percentage = (voteCount / group.members.length) * 100;

                  return (
                    <div key={option._id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">{option.text}</span>
                        <span className="text-sm font-bold text-primary-600">
                          {voteCount} votes ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <div className="relative h-2 bg-primary-100 rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-primary-600 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Member Votes</h3>

                {/* Members List */}
                <div className="max-h-[300px] overflow-y-auto space-y-3">
                  {group.members
                    .filter(member =>
                      !group.hiddenMembers?.includes(member._id)
                    )
                    .map(member => {
                      const memberVote = selectedPoll.options.find(option =>
                        option.votes?.some(vote =>
                          vote === member._id || (vote._id && vote._id === member._id)
                        )
                      );

                      return (
                        <div
                          key={member._id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary-200 transition duration-150"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                              {getInitials(member.firstName || member.username)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">
                                {member.firstName ? `${member.firstName} ${member.lastName || ''}` : member.username}
                                {member._id === user.id && " (You)"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {memberVote ? memberVote.text : 'Not voted'}
                              </div>
                            </div>
                          </div>

                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${memberVote
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {memberVote ? 'Voted' : 'Pending'}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowPollVotesModal(false)}
                  className="px-6 py-2.5 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition duration-150 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;

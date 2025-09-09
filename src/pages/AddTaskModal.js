import React, { useState, useEffect } from 'react';
import './Modal.css';

const AddTaskModal = ({ onClose, onSubmit, groupMembers = [] }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: []
  });

  const [selectedMembers, setSelectedMembers] = useState([]);

  // Toggle member selection
  const toggleMemberSelection = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  // Update task assigned members when selection changes
  useEffect(() => {
    setTaskData(prev => ({
      ...prev,
      assignedTo: selectedMembers
    }));
  }, [selectedMembers]);

  // Submit handler
  const submitForm = (e) => {
    e.preventDefault();

    console.log('Form submitted with data:', taskData);

    if (!taskData.title.trim()) {
      alert('Task title is required');
      return;
    }

    // Pass only the task data to the parent component
    onSubmit({
      title: taskData.title,
      description: taskData.description,
      deadline: taskData.deadline,
      assignedTo: selectedMembers
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add New Task</h2>
        <p className="modal-subtitle">As the group owner, you can add tasks for all members.</p>
        <form onSubmit={submitForm}>
          <div className="form-group">
            <label htmlFor="taskTitle">Task Title</label>
            <input
              id="taskTitle"
              type="text"
              placeholder="Enter task title"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="taskDescription">Description</label>
            <textarea
              id="taskDescription"
              placeholder="Enter task description"
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="taskDeadline">Deadline</label>
            <input
              id="taskDeadline"
              type="datetime-local"
              value={taskData.deadline}
              onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
              required
            />
          </div>

          {groupMembers.length > 0 && (
            <div className="form-group">
              <label>Assign To (Optional)</label>
              <div className="member-selection-list">
                {groupMembers.map(member => (
                  <div
                    key={member._id}
                    className={`member-selection-item ${selectedMembers.includes(member._id) ? 'selected' : ''}`}
                    onClick={() => toggleMemberSelection(member._id)}
                  >
                    <div className="member-avatar">
                      {member.firstName?.charAt(0) || member.username.charAt(0)}
                    </div>
                    <div className="member-name">
                      {member.firstName ? `${member.firstName} ${member.lastName || ''}` : member.username}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="submit">Create Task</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal; 
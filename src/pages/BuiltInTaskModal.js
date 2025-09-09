import React, { useState } from 'react';
import './Modal.css';
import { toast } from 'react-toastify';

// Enhanced built-in tasks with better descriptions and categorization
const BUILT_IN_TASKS = [
  {
    id: 'task1',
    title: 'Weekly Planning Session',
    description: 'Schedule a weekly meeting to plan upcoming tasks and set goals for the group.',
    category: 'Organization'
  },
  {
    id: 'task2',
    title: 'Progress Review',
    description: 'Review what the group has accomplished and identify areas for improvement.',
    category: 'Evaluation'
  },
  {
    id: 'task3',
    title: 'Knowledge Sharing Session',
    description: 'Each member shares something new they learned with the group.',
    category: 'Learning'
  },
  {
    id: 'task4',
    title: 'Group Discussion',
    description: 'Discuss a specific topic relevant to the group\'s interests or goals.',
    category: 'Communication'
  },
  {
    id: 'task5',
    title: 'Team Building Activity',
    description: 'Engage in an activity designed to improve group cohesion and collaboration.',
    category: 'Team Building'
  }
];

const BuiltInTaskModal = ({ onClose, onSelectTask }) => {
  const [builtInTasks] = useState(BUILT_IN_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [deadline, setDeadline] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectTask = (taskId) => {
    setSelectedTaskId(taskId);
  };

  const handleAddTask = () => {
    if (!selectedTaskId || !deadline) {
      toast.error('Please select a task and set a deadline');
      return;
    }

    const selectedTask = builtInTasks.find(task => task.id === selectedTaskId);
    if (!selectedTask) return;

    // Create task object with isBuiltIn flag set to true
    const taskData = {
      title: selectedTask.title,
      description: selectedTask.description,
      deadline: deadline,
      category: selectedTask.category,
      isBuiltIn: true  // Mark as built-in task
    };

    onSelectTask(taskData);
  };

  // Filter tasks based on search term
  const filteredTasks = builtInTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-content">
      <h2>Select a Built-in Task</h2>
      <p className="modal-subtitle">Choose from our curated list of predefined tasks to add to your group.</p>

      <div className="form-group">
        <label htmlFor="searchTasks">Search Tasks</label>
        <div className="search-input-container">
          <i className="fas fa-search search-icon"></i>
          <input
            id="searchTasks"
            type="text"
            placeholder="Search by title, description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="taskDeadline">Task Deadline</label>
        <input
          id="taskDeadline"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          className="deadline-input"
        />
      </div>

      <div className="built-in-task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`built-in-task-item ${selectedTaskId === task.id ? 'selected' : ''}`}
              onClick={() => handleSelectTask(task.id)}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span className="task-category">{task.category}</span>
            </div>
          ))
        ) : (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>No tasks match your search</p>
          </div>
        )}
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="primary-button"
          onClick={handleAddTask}
          disabled={!selectedTaskId || !deadline}
        >
          <i className="fas fa-plus"></i> Add Selected Task
        </button>
        <button type="button" className="secondary-button" onClick={onClose}>
          <i className="fas fa-times"></i> Cancel
        </button>
      </div>
    </div>
  );
};

export default BuiltInTaskModal; 
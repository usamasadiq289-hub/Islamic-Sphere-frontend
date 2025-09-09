import React, { useState } from 'react';
import './Modal.css';

const AddPollModal = ({ onClose, onSubmit }) => {
  const [poll, setPoll] = useState({
    title: '',
    description: '',
    options: ['', ''],
    deadline: '',
    isCustom: false
  });

  const addOption = () => {
    setPoll({ ...poll, options: [...poll.options, ''] });
  };

  const removeOption = (index) => {
    const newOptions = poll.options.filter((_, i) => i !== index);
    setPoll({ ...poll, options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...poll.options];
    newOptions[index] = value;
    setPoll({ ...poll, options: newOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedPoll = {
      ...poll,
      options: poll.options.map(text => ({ text, votes: [] }))
    };
    onSubmit(formattedPoll);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create New Poll</h2>
        <p className="modal-subtitle">As the group owner, you can create polls for all members to vote on.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Poll Title"
            value={poll.title}
            onChange={(e) => setPoll({ ...poll, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Poll Description"
            value={poll.description}
            onChange={(e) => setPoll({ ...poll, description: e.target.value })}
          />

          <div className="options-container">
            <label>Poll Options</label>
            {poll.options.map((option, index) => (
              <div key={index} className="option-input">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  required
                />
                {poll.options.length > 2 && (
                  <button type="button" onClick={() => removeOption(index)} className="remove-option-btn">
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addOption} className="add-option-btn">
              + Add Option
            </button>
          </div>
          <input
            type="datetime-local"
            value={poll.deadline}
            onChange={(e) => setPoll({ ...poll, deadline: e.target.value })}
            required
          />
          <div className="modal-actions">
            <button type="submit">Create Poll</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPollModal; 
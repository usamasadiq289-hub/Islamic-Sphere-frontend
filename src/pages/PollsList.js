import React, { useState, useEffect } from 'react';

const PollsList = ({
  polls,
  group,
  user,
  onVote,
  onDelete,
  onViewResults,
  userVoted
}) => {
  // Add state to track selected options for each poll
  const [selectedOptions, setSelectedOptions] = useState({});

  // Initialize selected options when polls change
  useEffect(() => {
    const initialSelections = {};
    polls.forEach(poll => {
      const userVote = poll.options.find(option => 
        option.votes?.includes(user.id)
      );
      if (userVote) {
        initialSelections[poll._id] = userVote._id;
      }
    });
    setSelectedOptions(initialSelections);
  }, [polls, user.id]);

  // Handle vote change
  const handleVoteChange = (pollId, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [pollId]: optionId
    }));
    onVote(pollId, optionId);
  };

  return (
    <>
      {polls.map(poll => (
        <div key={poll._id} className="bg-white rounded-xl shadow-md p-6 border-2 border-primary-100 hover:border-primary-200 transition duration-150">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">{poll.title}</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onViewResults(poll)}
                className="text-sm font-bold text-primary-600 hover:text-primary-700"
              >
                View Votes
              </button>
              {group.owner === user.id && (
                <button
                  onClick={() => onDelete(poll._id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1.5 rounded-full hover:bg-red-50"
                  title="Delete Poll"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <form className="space-y-3">
              {poll.options.map(option => {
                const isSelected = selectedOptions[poll._id] === option._id;
                const hasVoted = userVoted(poll, option);

                return (
                  <div key={option._id}
                    className={`p-4 rounded-lg transition duration-150 border-2 
                      ${isSelected 
                        ? 'border-primary-500 bg-primary-50 ' 
                        : 'border-primary-100 hover:border-primary-200'}`}
                  >
                    <label className="flex items-center w-full cursor-pointer">
                      <input
                        type="radio"
                        name={`poll-${poll._id}`}
                        checked={isSelected}
                        onChange={() => handleVoteChange(poll._id, option._id)}
                        className="w-4 h-4 text-primary-600 bg-white border-gray-300 focus:ring-primary-500 mr-3"
                      />
                      <span className="font-medium">{option.text}</span>
                      {hasVoted && (
                        <span className="ml-2 text-xs text-primary-600">
                          (Your vote)
                        </span>
                      )}
                    </label>
                  </div>
                );
              })}
            </form>
          </div>
        </div>
      ))}
    </>
  );
};

export default PollsList;
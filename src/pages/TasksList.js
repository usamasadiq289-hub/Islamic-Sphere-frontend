import React from 'react';

const TasksList = ({
  tasks,
  group,
  user,
  onTaskComplete,
  onTaskDelete,
  onViewProgress,
  calculateProgress
}) => {
  return (
    <>
      {tasks.map(task => {
        const isTaskCompletedByUser = task.usersCompleted?.some(uid =>
          uid === user.id || (uid._id && uid._id === user.id)
        );

        return (
          <div key={task._id} className="bg-white rounded-xl shadow-md p-6 border-2 border-primary-100 hover:border-primary-200 transition duration-150">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{task.title}</h3>
                <p className="text-sm font-medium text-gray-600">{task.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onViewProgress(task)}
                  className="text-sm font-bold text-primary-600 hover:text-primary-700"
                >
                  View Progress
                </button>

                <button
                  onClick={() => onTaskComplete(task._id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${isTaskCompletedByUser
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                >
                  {isTaskCompletedByUser ? 'Completed ✓' : 'Complete'}
                </button>

                {group.owner === user.id && (
                  <button
                    onClick={() => onTaskDelete(task._id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1.5 rounded-full hover:bg-red-50"
                    title="Delete Task"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="relative h-3 bg-primary-100 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${calculateProgress(task)}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm font-bold text-primary-600 text-right">
                {task.usersCompleted?.length || 0} of {group.members?.length || 0} completed
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default TasksList; 
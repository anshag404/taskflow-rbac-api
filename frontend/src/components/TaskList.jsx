import { useAuth } from '../context/AuthContext';

function TaskList({ tasks, onEdit, onDelete, loading }) {
  const { isAdmin } = useAuth();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="task-list-section">
        <h2>📋 Your Tasks</h2>
        <div className="page-loader" style={{ minHeight: 150 }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-section" id="task-list-section">
      <h2>{isAdmin ? '📋 All Tasks' : '📋 Your Tasks'} ({tasks.length})</h2>
      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p>No tasks yet. Create your first task above!</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div className="task-item" key={task.id} id={`task-${task.id}`}>
              <div className="task-item-content">
                <div className="task-item-title">{task.title}</div>
                {task.description && (
                  <div className="task-item-desc">{task.description}</div>
                )}
                <div className="task-item-meta">
                  <span>{formatDate(task.createdAt)}</span>
                  {isAdmin && task.user && (
                    <>
                      <span>•</span>
                      <span className="task-owner">{task.user.name}</span>
                    </>
                  )}
                </div>
              </div>
              <span className={`status-badge ${task.status}`}>
                {statusLabel(task.status)}
              </span>
              <div className="task-item-actions">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onEdit(task)}
                  title="Edit task"
                  id={`edit-task-${task.id}`}
                >
                  ✏️
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onDelete(task.id)}
                  title="Delete task"
                  id={`delete-task-${task.id}`}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;

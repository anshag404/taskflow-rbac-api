import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll();
      setTasks(response.data.data.tasks);
    } catch (error) {
      showMessage('error', 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (data) => {
    try {
      setFormLoading(true);
      await tasksAPI.create(data);
      showMessage('success', 'Task created successfully!');
      fetchTasks();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create task.';
      showMessage('error', msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (data) => {
    if (!editingTask) return;
    try {
      setFormLoading(true);
      await tasksAPI.update(editingTask.id, data);
      showMessage('success', 'Task updated successfully!');
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update task.';
      showMessage('error', msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await tasksAPI.delete(taskId);
      showMessage('success', 'Task deleted successfully!');
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete task.';
      showMessage('error', msg);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    // Scroll to form
    document.getElementById('task-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // Compute stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="dashboard" id="dashboard-page">
      <div className="dashboard-header">
        <h1>
          {isAdmin ? '🛡️ Admin Dashboard' : `👋 Welcome, ${user?.name}`}
        </h1>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`} id="dashboard-message">
          {message.type === 'success' ? '✅' : '⚠️'} {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card total">
          <div className="stat-label">Total Tasks</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{stats.pending}</div>
        </div>
        <div className="stat-card progress">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">{stats.inProgress}</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{stats.completed}</div>
        </div>
      </div>

      {/* Task Form */}
      <TaskForm
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask}
        onCancel={handleCancelEdit}
        loading={formLoading}
      />

      {/* Task List */}
      <TaskList
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        loading={loading}
      />
    </div>
  );
}

export default Dashboard;

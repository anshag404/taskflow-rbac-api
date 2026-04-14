const { Task, User } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

class TaskService {
  /**
   * Create a new task
   * @param {string} userId - Owner user ID
   * @param {Object} data - { title, description, status }
   * @returns {Object} Created task
   */
  async createTask(userId, data) {
    const task = await Task.create({
      ...data,
      userId,
    });

    logger.info(`Task created: "${task.title}" by user ${userId}`);
    return task;
  }

  /**
   * Get tasks - users see their own, admins see all
   * @param {string} userId - Requesting user's ID
   * @param {string} role - User's role
   * @returns {Array} List of tasks
   */
  async getTasks(userId, role) {
    const queryOptions = {
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    };

    // Users only see their own tasks; admins see all
    if (role !== 'admin') {
      queryOptions.where = { userId };
    }

    return Task.findAll(queryOptions);
  }

  /**
   * Get a single task by ID
   * @param {string} taskId - Task ID
   * @param {string} userId - Requesting user's ID
   * @param {string} role - User's role
   * @returns {Object} Task
   */
  async getTaskById(taskId, userId, role) {
    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!task) {
      throw ApiError.notFound('Task not found.');
    }

    // Users can only access their own tasks
    if (role !== 'admin' && task.userId !== userId) {
      throw ApiError.forbidden('You do not have permission to access this task.');
    }

    return task;
  }

  /**
   * Update a task
   * @param {string} taskId - Task ID
   * @param {string} userId - Requesting user's ID
   * @param {string} role - User's role
   * @param {Object} data - Fields to update
   * @returns {Object} Updated task
   */
  async updateTask(taskId, userId, role, data) {
    const task = await Task.findByPk(taskId);

    if (!task) {
      throw ApiError.notFound('Task not found.');
    }

    // Users can only update their own tasks
    if (role !== 'admin' && task.userId !== userId) {
      throw ApiError.forbidden('You do not have permission to update this task.');
    }

    await task.update(data);

    logger.info(`Task updated: "${task.title}" (${taskId})`);
    return task;
  }

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @param {string} userId - Requesting user's ID
   * @param {string} role - User's role
   */
  async deleteTask(taskId, userId, role) {
    const task = await Task.findByPk(taskId);

    if (!task) {
      throw ApiError.notFound('Task not found.');
    }

    // Users can only delete their own tasks
    if (role !== 'admin' && task.userId !== userId) {
      throw ApiError.forbidden('You do not have permission to delete this task.');
    }

    await task.destroy();

    logger.info(`Task deleted: "${task.title}" (${taskId})`);
  }
}

module.exports = new TaskService();

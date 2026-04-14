const taskService = require('../services/taskService');

/**
 * @desc    Create a new task
 * @route   POST /api/v1/tasks
 * @access  Private
 */
const create = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks (users: own tasks, admin: all tasks)
 * @route   GET /api/v1/tasks
 * @access  Private
 */
const getAll = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks(req.user.id, req.user.role);

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/v1/tasks/:id
 * @access  Private
 */
const getById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      status: 'success',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/v1/tasks/:id
 * @access  Private
 */
const update = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.user.id,
      req.user.role,
      req.body
    );

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Private
 */
const remove = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.id, req.user.role);

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getById, update, remove };

const express = require('express');
const { z } = require('zod');
const { create, getAll, getById, update, remove } = require('../controllers/taskController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Validation schemas
const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional()
    .default(''),
  status: z
    .enum(['pending', 'in_progress', 'completed'])
    .optional()
    .default('pending'),
});

const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must not exceed 200 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  status: z
    .enum(['pending', 'in_progress', 'completed'])
    .optional(),
});

// All routes require authentication
router.use(auth);

// Routes
router.post('/', validate(createTaskSchema), create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', validate(updateTaskSchema), update);
router.delete('/:id', remove);

module.exports = router;

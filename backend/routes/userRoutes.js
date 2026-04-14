const express = require('express');
const { getAll, getById, remove } = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// All routes require authentication + admin role
router.use(auth);
router.use(roleCheck(['admin']));

// Routes
router.get('/', getAll);
router.get('/:id', getById);
router.delete('/:id', remove);

module.exports = router;

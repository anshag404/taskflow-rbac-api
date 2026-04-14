const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, role }
   * @returns {Object} - { user, token }
   */
  async register({ name, email, password, role = 'user' }) {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw ApiError.conflict('A user with this email already exists.');
    }

    // Create user (password hashed via model hook)
    const user = await User.create({ name, email, password, role });
    const token = this.generateToken(user);

    logger.info(`New user registered: ${email} (role: ${role})`);

    return {
      user: user.toJSON(),
      token,
    };
  }

  /**
   * Login user with email and password
   * @param {Object} credentials - { email, password }
   * @returns {Object} - { user, token }
   */
  async login({ email, password }) {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const token = this.generateToken(user);

    logger.info(`User logged in: ${email}`);

    return {
      user: user.toJSON(),
      token,
    };
  }

  /**
   * Generate JWT token
   * @param {Object} user - User instance
   * @returns {string} JWT token
   */
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      }
    );
  }
}

module.exports = new AuthService();

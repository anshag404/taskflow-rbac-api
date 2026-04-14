const { Sequelize } = require('sequelize');
const path = require('path');
const logger = require('../utils/logger');

// SQLite configuration (zero-config, file-based)
// To switch to PostgreSQL, change dialect and provide connection params
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
  },
});

/**
 * Test database connection
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully');
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

/**
 * Sync all models with database
 */
const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    logger.info('✅ Database models synchronized');
  } catch (error) {
    logger.error('❌ Database sync failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB, syncDB };

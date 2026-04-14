const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_USER = 'postgres',
  DB_PASSWORD = 'password',
  DB_NAME = 'postgres',
  DB_DIALECT = 'postgres',
} = process.env;

// Initialize Sequelize for PostgreSQL
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
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
    logger.info('✅ PostgreSQL connection established successfully');
  } catch (error) {
    logger.error(`❌ Unable to connect to PostgreSQL database: ${error.message}`);
    logger.info(`👉 Ensure PostgreSQL is running on ${DB_HOST}:${DB_PORT} with user '${DB_USER}'`);
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

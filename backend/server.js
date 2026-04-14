require('dotenv').config();
const app = require('./app');
const { connectDB, syncDB } = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

/**
 * Start server
 * 1. Connect to database
 * 2. Sync models
 * 3. Listen on configured port
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Sync models (creates/alters tables)
    await syncDB();

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();

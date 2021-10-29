import express from 'express';
import http from 'http';
import config from './config';
import { logger } from './lib';

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  server
    .listen(config.PORT, () =>
      logger.info(`🛡️  Server listening on port: ${config.PORT} 🛡️`)
    )
    .on('error', (error: any) => {
      if (error.syscall !== 'listen') throw error;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          logger.error(`❌ PORT ${config.PORT} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`❌ PORT ${config.PORT} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

  /**
   * Event listener for process "error" events.
   */
  process.on('unhandledRejection', (error: any) => {
    logger.error(error);
    server.close(() => process.exit());
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM RECEIVED, shutting down the app');
    // Serve all the requests before shutting down
    server.close(() => {
      logger.info('App terminated');
    });
  });
}

startServer();

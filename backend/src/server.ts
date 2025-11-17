/**
 * @summary
 * Main server entry point for the StockBox API.
 * Configures Express application with security, CORS, compression,
 * and error handling middleware.
 *
 * @module server
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from '@/config';
import { errorMiddleware } from '@/middleware/error';
import { notFoundMiddleware } from '@/middleware/notFound';
import apiRoutes from '@/routes';
import { runDatabaseMigrations } from './migrations/migration-runner';

const app: Application = express();

/**
 * @rule {be-security-middleware}
 * Security middleware configuration
 */
app.use(helmet());
app.use(cors(config.api.cors));

/**
 * @rule {be-request-processing}
 * Request processing middleware
 */
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * Logging middleware
 */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/**
 * @rule {be-health-check}
 * Health check endpoint (no versioning)
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'StockBox API',
  });
});

/**
 * @rule {be-api-versioning}
 * API Routes with versioning
 * Creates routes like:
 * - /api/v1/external/...
 * - /api/v1/internal/...
 */
app.use('/api', apiRoutes);

/**
 * @rule {be-error-handling}
 * 404 handler
 */
app.use(notFoundMiddleware);

/**
 * Error handling middleware
 */
app.use(errorMiddleware);

/**
 * @rule {be-server-startup}
 * Application startup with database migrations
 */
let server: any;

async function startApplication() {
  try {
    console.log('Checking database migrations...');
    await runDatabaseMigrations({
      skipIfNoNewMigrations: true,
      logLevel: 'minimal',
    });
    console.log('✓ Database ready\n');

    server = app.listen(config.api.port, () => {
      console.log(
        `Server running on port ${config.api.port} in ${process.env.NODE_ENV || 'development'} mode`
      );
      console.log(`API available at http://localhost:${config.api.port}/api/${config.api.version}`);
    });
  } catch (error: any) {
    console.error('Failed to start application:', error.message);
    process.exit(1);
  }
}

/**
 * @rule {be-graceful-shutdown}
 * Graceful shutdown handler
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

startApplication();

export default server;

import express from 'express';
import { setupMiddleware } from '@/middleware/index.js';
import { setupRoutes } from '@/routes/index.js';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandlers.js';

export const createApp = () => {
  const app = express();

  // Setup middleware
  setupMiddleware(app);

  // Setup routes
  setupRoutes(app);

  // Error handlers (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
import express from 'express';
import { setupMiddleware } from '@/middleware/index.js';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandlers.js';
import { routes } from './lib/ApiRouter';
import './routes'; //this imports all the routes
import { auth } from '@/lib/auth';
import { toNodeHandler } from 'better-auth/node';

export const createApp = () => {
  const app = express();

  // Setup middleware
  setupMiddleware(app);

  //betterauth route
  app.all("/api/auth/*splat", toNodeHandler(auth)); // For Express v5

  //setting up routes
  app.use("/api", routes);

  // Error handlers (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
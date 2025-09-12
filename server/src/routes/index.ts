import express from 'express';
import { healthRouter } from '@/routes/health.js';
import { apiRouter } from '@/routes/api.js';
import { auth } from '@/lib/auth.js';
import { toNodeHandler } from 'better-auth/node';

export const setupRoutes = (app: express.Application) => {
  // Health check routes
  app.use('/health', healthRouter);
  
  // API routes
  app.use('/api', apiRouter);

  //betterAuth route
  app.all("/api/auth/*splat", toNodeHandler(auth));
};
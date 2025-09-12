import express from 'express';
import { healthRouter } from '@/routes/health.js';
import { apiRouter } from '@/routes/api.js';

export const setupRoutes = (app: express.Application) => {
  // Health check routes
  app.use('/health', healthRouter);
  
  // API routes
  app.use('/api', apiRouter);
};
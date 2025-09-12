import express from 'express';
import { config } from '@/config/index.js';

// 404 handler
export const notFoundHandler = (req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
};

// Global error handler
export const errorHandler = (
  err: Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    error: 'Internal server error',
    message: config.server.environment === 'development' ? err.message : 'Something went wrong',
  });
};
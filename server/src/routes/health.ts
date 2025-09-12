import express from 'express';
import { db } from '@/db/index.js';
import { config } from '@/config/index.js';

export const healthRouter = express.Router();

healthRouter.get('/', async (req, res) => {
  try {
    // Test database connection
    await db.execute('SELECT 1');
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.server.environment,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
    });
  }
});
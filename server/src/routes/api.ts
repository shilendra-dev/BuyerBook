import express from 'express';
import { config } from '@/config/index.js';

export const apiRouter = express.Router();

apiRouter.get('/', (req, res) => {
  res.json({
    message: 'BuyerBook API',
    version: '1.0.0',
    environment: config.server.environment,
  });
});

// Add more API routes here as you build features
// Example:
// apiRouter.use('/auth', authRouter);
// apiRouter.use('/users', usersRouter);
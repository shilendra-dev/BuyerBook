import express from 'express';
import { config } from '@/config/index.js';
import { createApi } from '@/lib/ApiRouter.js';
import { getPublicData, getPrivateData, createData } from '@/controllers/example.controller.js';

export const apiRouter = express.Router();

// Create API router instance
const api = createApi();

// API info endpoint
api.get('/').noAuth(async (req, res) => {
  return {
    status: 200,
    message: 'BuyerBook API',
    data: {
      version: '1.0.0',
      environment: config.server.environment,
    },
    type: 'success'
  };
});

// Example routes using controllers
api.get('/public').noAuth(getPublicData);
api.get('/private').authSecure(getPrivateData);
api.post('/data').authSecure(createData);

// Mount the API routes
apiRouter.use('/', api.getRouter());

// Add more API routes here as you build features
// Example:
// apiRouter.use('/auth', authRouter);
// apiRouter.use('/users', usersRouter);
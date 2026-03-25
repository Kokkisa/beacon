import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan, { StreamOptions } from 'morgan';
import 'dotenv/config';
import logger from '../apps/api/src/utils/logger';
import { errorHandler } from '../apps/api/src/middleware/errorHandler';
import authRoutes from '../apps/api/src/routes/authRoutes';
import integrationRoutes from '../apps/api/src/routes/integrationRoutes';
import syncRoutes from '../apps/api/src/routes/syncRoutes';
import { VercelRequest, VercelResponse } from '@vercel/node';

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const morganStream: StreamOptions = {
  write: (msg: string) => logger.info(msg.trim()),
};
app.use(morgan('combined', { stream: morganStream }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/syncs', syncRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Export as Vercel serverless function
export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};

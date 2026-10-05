import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './routes/health.routes';
import productsRouter from './routes/products.routes';
import ordersRouter from './routes/orders.routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app: Express = express();

// Middleware setup
const allowedOrigins = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigins === '*' ? '*' : allowedOrigins.split(',').map((o) => o.trim()),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Azure 3-Tier E-Commerce Backend API',
    status: 'running',
    docs: {
      health: 'GET /api/health',
      products: 'GET /api/products',
      orders: 'POST /api/orders',
    },
  });
});

// Mount API routes
app.use('/api', healthRouter);
app.use('/api', productsRouter);
app.use('/api', ordersRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;


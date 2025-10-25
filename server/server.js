import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import vehicleRoutes from './routes/vehicles.js';
import offerRoutes from './routes/offers.js';
import customerRoutes from './routes/customers.js';
import inquiryRoutes from './routes/inquiries.js';
import analyticsRoutes from './routes/analytics.js';
import authRoutes from './routes/auth.js';
import achievementRoutes from './routes/achievements.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ev_vehicles';
mongoose.connect(MONGODB_URI).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ Failed to connect to MongoDB:', err.message);
});

// Security middleware
app.use(helmet());
// CORS configuration
// In development allow any origin (so mobile/dev-hosted frontends can call the API).
// In production restrict to the configured client URL and known hosts.
const corsOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:3000',
  'https://ev-d88b.onrender.com',
  'https://vechileadmin.netlify.app'
];

const corsOptions = process.env.NODE_ENV === 'development'
  ? { origin: true, credentials: true }
  : { origin: corsOrigins, credentials: true };

app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'development') {
  console.log('⚙️  CORS: development mode - allowing requests from any origin');
} else {
  console.log('⚙️  CORS: production mode - allowed origins:', corsOrigins);
}

// Rate limiting - DISABLED for development
// TODO: Re-enable for production
/*
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Very high limit for development (5000 requests per 15 minutes)
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);
*/

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

console.log('�️ Using MongoDB storage');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/achievements', achievementRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error.middleware');
const initSocketIO = require('./sockets/socket.handler');

// Route Imports
const authRoutes = require('./routes/auth.routes');
const teamRoutes = require('./routes/team.routes');
const projectRoutes = require('./routes/project.routes');
const analyticsRoutes = require('./routes/analytics.routes');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Allowed Origins for Production & Development
const allowedOrigins = [
  'https://synccore-kappa.vercel.app',
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      // Allow any origin if CLIENT_URL is not strictly enforced
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Initialize Socket.io with production CORS and 50MB payload limit
const io = new Server(server, {
  maxHttpBufferSize: 5e7, // 50MB
  cors: {
    origin: '*', // Allow connections from live Vercel domain & WebSocket handshake
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

initSocketIO(io);

// Global Middleware Pipeline
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logger middleware for debugging
app.use((req, res, next) => {
  console.log(`[HTTP Request] ${req.method} ${req.originalUrl}`);
  next();
});

// API Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'SyncCore Team Collaboration API Platform',
    clientUrl: 'https://synccore-kappa.vercel.app',
    timestamp: new Date(),
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'SyncCore Backend API Service is Live',
    frontend: 'https://synccore-kappa.vercel.app',
    health: '/health',
  });
});

// Mount Express API Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', projectRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.originalUrl}`,
  });
});

// Centralized Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `==================================================\n` +
    `  SyncCore Server running in ${process.env.NODE_ENV || 'development'} mode\n` +
    `  Listening on HTTP & WebSocket Port: ${PORT}\n` +
    `  Live Frontend Allowed: https://synccore-kappa.vercel.app\n` +
    `==================================================`
  );
});

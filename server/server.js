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

// Initialize Socket.io with 50MB maxHttpBufferSize for image attachments
const io = new Server(server, {
  maxHttpBufferSize: 5e7, // 50MB
  cors: {
    origin: '*', // Configurable for production frontend origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

initSocketIO(io);

// Global Middleware Pipeline with 50mb payload body parser limit
app.use(cors());
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
    timestamp: new Date(),
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

// Centralized Error Handler Middleware (Must be last middleware layer)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `==================================================\n` +
    `  SyncCore Server running in ${process.env.NODE_ENV || 'development'} mode\n` +
    `  Listening on HTTP & WebSocket Port: ${PORT}\n` +
    `==================================================`
  );
});

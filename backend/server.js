require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { initializeSocket } = require('./services/socketService');

// Connect to MongoDB Database
connectDB();

const app = express();
const server = http.createServer(app);

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core API routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ai', aiRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'QuizAI API is healthy and operational.' });
});

// Initialize Socket.IO connection manager
initializeSocket(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  🚀 QuizAI Backend Running!
  =========================================
  📡 REST API:     http://localhost:${PORT}/api
  🔌 WebSockets:   ws://localhost:${PORT}
  💻 Current Time: ${new Date().toISOString()}
  =========================================
  ✨ Premium startup server is ready for traffic.
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Logged Error: ${err.message}`);
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
// In production: uses FRONTEND_URL env variable (set to your Vercel URL)
// In development: allows localhost:5173 (Vite default)
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
// const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resumeiq';
// mongoose.connect(process.env.MONGO_URI);
// const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resumeiq';
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log(" Connected successfully to MongoDB Atlas/Local instance.");
//   })
//   .catch((err) => {
//     console.error(" MongoDB database connection error:", err.message);
//   });

const mongoURI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/resumeiq";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected successfully to MongoDB.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Health check / welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ResumeIQ API. Backend is running successfully!' });
});

// Routes API mount
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

// Centralized error-handling middleware (critical for clean API architectures)
app.use((err, req, res, next) => {
  console.error('Centralized Error Handler:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected internal server error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(` Server successfully launched on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});

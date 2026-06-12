import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import route files
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Note: authRoutes has paths starting with /auth and /users, so we mount it at /api and /api/auth to support all frontend requests
app.use('/api', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Employee Knowledge Platform API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server', error: err.message });
});

// Database connection & Server Startup
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/knowledge_sharing');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    app.listen(PORT, () => {
      console.log(`Server running in development mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

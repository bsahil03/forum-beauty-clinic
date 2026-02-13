import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import infoRoutes from './routes/infoRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/stats', statsRoutes);

// Production – Serve React frontend
if (process.env.NODE_ENV === 'production') {

  // 1. Serve static files (js, css, images)
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // 2. All other routes → send index.html (React Router handles client-side)
  // Use a regex to avoid conflicting with /api/*
  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// Error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
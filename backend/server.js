import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

// Models
import Info from './models/Info.js';
import Photo from './models/Photo.js';
import Service from './models/Service.js';
import User from './models/User.js';
import Offer from './models/Offer.js';
import Stats from './models/Stats.js';

// Middleware
import auth from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import infoRoutes from './routes/infoRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ==================== AUTO SEEDING (Improved & Reliable) ====================
const seedDatabase = async () => {
  try {
    console.log('\n[SEED] Starting database check...');

    // 1. Create Admin User
    if ((await User.countDocuments()) === 0) {
      const hashed = await bcrypt.hash('admin123', 10);
      await new User({ username: 'admin', password: hashed }).save();
      console.log('✅ Default admin created → username: admin | password: admin123');
    }

    // 2. Create Clinic Info
    if ((await Info.countDocuments()) === 0) {
      await new Info({
        name: 'Forum Beauty Care & Aesthetic Clinic',
        address: 'F7 Shree Ram Avenue near HP Petrol Pump, Kalikund Balva Road Dholka-Ahmedabad, 382225',
        contact: '9313706593',
        instagram: 'forum_beauty_aesthetic_clinic',
        ownerName: 'Sejal Dhumda'
      }).save();
      console.log('✅ Clinic Info seeded');
    }

    // 3. Create Services (Most Important Fix)
    const serviceDoc = await Service.findOne();
    if (!serviceDoc || !serviceDoc.data || Object.keys(serviceDoc.data).length === 0) {
      console.log('✅ Seeding all services...');

      const initialServices = {
        waxing: [
          { name: 'Hands: Cream', price: 150 }, { name: 'Hands: Rica', price: 300 },
          { name: 'Half Legs: Cream', price: 150 }, { name: 'Half Legs: Rica', price: 300 },
          { name: 'Full Legs: Cream', price: 300 }, { name: 'Full Legs: Rica', price: 600 },
          { name: 'Underarms: Cream', price: 50 }, { name: 'Underarms: Rica', price: 100 },
          { name: 'Facewax: Cream', price: 100 }, { name: 'Facewax: Rica', price: 150 }
        ],
        threading: [
          { name: 'Eyebrow', price: 50 },
          { name: 'Face', price: 100 },
          { name: 'Upperlips', price: 20 }
        ],
        haircuts: [
          { name: 'Straight Cut', price: 100 }, { name: 'U Cut', price: 100 },
          { name: 'V Cut', price: 100 }, { name: 'Baby Cut', price: 100 },
          { name: 'Feather Cut', price: 300 }, { name: 'Curly Cut', price: 350 },
          { name: 'V Section Cut', price: 400 }, { name: 'Square Layer', price: 400 },
          { name: 'Star Layer', price: 400 }, { name: 'Diamond Layer', price: 400 },
          { name: 'Inform Layer', price: 450 }, { name: 'Butterfly Cut', price: 500 }
        ],
        hair: [
          { name: 'Hair Spa', price: 700 },
          { name: 'Hair Color', price: 'Starting 1000' },
          { name: 'Permanent Hair Straightening (Shoulder Length)', price: 3000 },
          { name: 'Temporary Hair Straightening', price: 400 },
          { name: 'Hair Curls', price: 500 },
          { name: 'Global Highlights', price: 1500 }
        ],
        facial: [
          { name: 'Anti-Aging', price: 800 },
          { name: 'Brightening Whitening', price: 800 },
          { name: 'Hydra Glow', price: 700 },
          { name: 'Bridal', price: 500 },
          { name: 'Korean Glass Glow', price: 700 },
          { name: 'Gold', price: 400 },
          { name: 'Glow Booster', price: 700 },
          { name: 'Raga', price: 400 }
        ],
        others: [
          { name: 'D-Tan', price: 250 },
          { name: 'Cleanup', price: 300 },
          { name: 'Manicure', price: 500 },
          { name: 'Pedicure', price: 500 },
          { name: 'Body Polishing', price: 2000 }
        ],
        aesthetic: [
          { name: 'Hydra Facial', price: 1499 },
          { name: 'Skin Peeling', price: 2999 },
          { name: 'Micro Needling', price: 4999 },
          { name: 'Micro Dermabrasion', price: 1999 }
        ],
        makeup: [
          { name: 'Sider (Simple)', price: 1000 },
          { name: 'Sider (HD)', price: 2000 },
          { name: 'Engagement & Baby Shower (Simple)', price: 1500 },
          { name: 'Engagement & Baby Shower (HD)', price: 2500 },
          { name: 'Bridal Package 1', price: 10000 },
          { name: 'Bridal Package 2', price: 15000 },
          { name: 'Bridal Package 3', price: 20000 },
          { name: 'Bridal Package 4', price: 25000 }
        ]
      };

      await Service.findOneAndUpdate({}, { data: initialServices }, { upsert: true, new: true });
      console.log('✅ All services seeded successfully');
    } else {
      console.log('✅ Services already exist');
    }

    console.log('✅ Database seeding check completed\n');

  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
  }
};

// Run seeding automatically when server starts
seedDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/stats', statsRoutes);

// Production - Serve React (Optional)
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
//   });
// }

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
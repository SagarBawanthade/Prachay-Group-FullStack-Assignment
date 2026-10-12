import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded regardless of execution working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import voucherRoutes from './routes/voucherRoutes.js';
import signatureRoutes from './routes/signatureRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with dynamic origin support for local, VPS, and cloud domains
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Expense Voucher Management System API is live',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/signatures', signatureRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start Server after connecting to Database
const startServer = async () => {
  await connectDB();

  // Auto-seed if users or vouchers are empty
  try {
    const { User } = await import('./models/User.js');
    const { Voucher } = await import('./models/Voucher.js');
    const [userCount, voucherCount] = await Promise.all([
      User.countDocuments(),
      Voucher.countDocuments(),
    ]);

    if (userCount === 0 || voucherCount === 0) {
      console.log(`Database check: ${userCount} users, ${voucherCount} vouchers. Automatically seeding demo data...`);
      const { seedDatabase } = await import('./seed.js');
      await seedDatabase();
    }
  } catch (seedErr) {
    console.error('Auto-seed check failed:', seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`Expense Voucher API Server running on port ${PORT}`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
  });
};

startServer();

export default app;

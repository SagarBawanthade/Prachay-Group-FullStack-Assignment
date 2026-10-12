import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import voucherRoutes from './routes/voucherRoutes.js';
import signatureRoutes from './routes/signatureRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with support for frontend client
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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

  // If running in development or in-memory, auto-seed if no users exist
  try {
    const { User } = await import('./models/User.js');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found in database. Automatically seeding demo accounts & vouchers...');
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

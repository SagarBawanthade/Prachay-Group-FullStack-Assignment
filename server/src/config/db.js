import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_voucher_db';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`⚠️ Standard MongoDB connection failed (${err.message}). Attempting in-memory MongoDB fallback...`);
    
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      const memConn = await mongoose.connect(inMemoryUri);
      console.log(`✅ MongoMemoryServer Started & Connected: ${memConn.connection.host}`);
      console.log(`ℹ️ In-memory database enabled for seamless local demonstration and testing.`);
    } catch (memErr) {
      console.error(`❌ Failed to start in-memory MongoDB fallback:`, memErr);
      process.exit(1);
    }
  }
};

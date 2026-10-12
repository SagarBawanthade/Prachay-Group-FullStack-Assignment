import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_voucher_db';

  const isAtlas = mongoURI.includes('mongodb+srv://') || mongoURI.includes('.mongodb.net');
  const timeoutMs = isAtlas ? 10000 : 2500;

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: timeoutMs,
    });
    console.log(`MongoDB Connected (${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB'}): ${conn.connection.host}`);
  } catch (err) {
    console.warn(`MongoDB connection failed (${err.message}). Attempting in-memory fallback for local demo...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      const memConn = await mongoose.connect(inMemoryUri);
      console.log(`MongoMemoryServer Started & Connected: ${memConn.connection.host}`);
      console.log(`In-memory database enabled for seamless local demonstration and testing.`);
    } catch (memErr) {
      console.error(`Failed to start in-memory MongoDB fallback:`, memErr);
      process.exit(1);
    }
  }
};

import mongoose from 'mongoose';

// Check if we're using mock mode
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexo_gaming';

// Global cache type
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isMock: boolean;
}

// Global cache for mongoose connection
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null, isMock: false };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to MongoDB database
 * Uses connection caching to avoid multiple connections in development
 * Returns null if using mock mode
 */
export async function connectDB(): Promise<typeof mongoose | null> {
  // If using mock data, skip database connection
  if (USE_MOCK_DATA) {
    console.log('🎮 Running in MOCK MODE - No database required');
    cached.isMock = true;
    return null;
  }

  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if not exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Helper to check if we're in mock mode
export function isMockMode(): boolean {
  return USE_MOCK_DATA || cached.isMock;
}

export default connectDB;

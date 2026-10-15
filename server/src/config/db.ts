import mongoose from "mongoose";

let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<void> => {
  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // If a connection is already in progress, await the existing promise
  if (cachedPromise && mongoose.connection.readyState === 2) {
    await cachedPromise;
    return;
  }

  const connUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lms_db";
  const rawDbName = process.env.DB_NAME || "learningDB";
  // MongoDB Atlas has exact casing: [learningDB]. Normalize any case variations.
  const dbName = rawDbName.toLowerCase() === "learningdb" ? "learningDB" : rawDbName;

  console.log(`Connecting to MongoDB (database: ${dbName})...`);

  cachedPromise = mongoose.connect(connUri, {
    dbName,
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
    bufferCommands: false, // In serverless, do not buffer queries when disconnected
  });

  try {
    await cachedPromise;
    console.log(
      `MongoDB Connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`
    );
  } catch (error: any) {
    cachedPromise = null;
    console.warn(`MongoDB Connection Warning: ${error.message}`);
    // Don't rethrow here so fallback caches can serve data safely
  }
};


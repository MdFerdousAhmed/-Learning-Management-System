"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let cachedPromise = null;
const connectDB = async () => {
    // If already connected, return immediately
    if (mongoose_1.default.connection.readyState === 1) {
        return;
    }
    // If a connection is already in progress, await the existing promise
    if (cachedPromise && mongoose_1.default.connection.readyState === 2) {
        await cachedPromise;
        return;
    }
    const connUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lms_db";
    const rawDbName = process.env.DB_NAME || "learningDB";
    // MongoDB Atlas has exact casing: [learningDB]. Normalize any case variations.
    const dbName = rawDbName.toLowerCase() === "learningdb" ? "learningDB" : rawDbName;
    console.log(`Connecting to MongoDB (database: ${dbName})...`);
    cachedPromise = mongoose_1.default.connect(connUri, {
        dbName,
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000,
        bufferCommands: false, // In serverless, do not buffer queries when disconnected
    });
    try {
        await cachedPromise;
        console.log(`MongoDB Connected successfully to ${mongoose_1.default.connection.host}/${mongoose_1.default.connection.name}`);
    }
    catch (error) {
        cachedPromise = null;
        console.warn(`MongoDB Connection Warning: ${error.message}`);
        // Don't rethrow here so fallback caches can serve data safely
    }
};
exports.connectDB = connectDB;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const connUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lms_db";
        const dbName = process.env.DB_NAME || "learningdb";
        console.log(`Connecting to MongoDB at: ${connUri} (database: ${dbName})...`);
        await mongoose_1.default.connect(connUri, {
            dbName,
            serverSelectionTimeoutMS: 15000,
        });
        console.log(`MongoDB Connected successfully to ${mongoose_1.default.connection.host}/${mongoose_1.default.connection.name}`);
    }
    catch (error) {
        console.warn(`MongoDB Connection Warning: ${error.message}`);
        console.warn("Ensure MongoDB service is running (e.g., mongod or MongoDB Atlas URI). The server will remain alive.");
    }
};
exports.connectDB = connectDB;

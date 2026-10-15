"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
// Route modules
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const enrollmentRoutes_1 = __importDefault(require("./routes/enrollmentRoutes"));
const submissionRoutes_1 = __importDefault(require("./routes/submissionRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000", // Next.js dev server
        "http://localhost:5000", // Express itself (for testing)
    ],
    credentials: true, // Required for Better Auth session cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
// ---------------------------------------------------------------------------
// 1. Standard Auth Routes (/api/auth/register, /api/auth/login, /api/auth/me)
// Must be mounted BEFORE Better Auth splat to prevent wildcard interception!
// ---------------------------------------------------------------------------
app.use("/api/auth", authRoutes_1.default);
// ---------------------------------------------------------------------------
// 2. Better Auth handler – mounted at /api/auth/* for Better Auth clients
// (e.g. /api/auth/sign-in/email, /api/auth/sign-up/email, /api/auth/get-session)
// ---------------------------------------------------------------------------
app.all("/api/auth/*splat", async (req, res, next) => {
    try {
        const { auth } = await Promise.resolve().then(() => __importStar(require("./lib/auth")));
        // Build the full URL
        const protocol = req.protocol;
        const host = req.get("host") || `localhost:${port}`;
        const url = new URL(req.url, `${protocol}://${host}`);
        // Forward headers from Express to Web API
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
            if (value !== undefined) {
                headers.set(key, Array.isArray(value) ? value.join(", ") : value);
            }
        }
        // Build request body for non-GET/HEAD methods
        let body;
        if (req.method !== "GET" && req.method !== "HEAD") {
            body = JSON.stringify(req.body);
            if (!headers.has("content-type")) {
                headers.set("content-type", "application/json");
            }
        }
        const webRequest = new Request(url.toString(), {
            method: req.method,
            headers,
            body,
        });
        // Call Better Auth handler
        const webResponse = await auth.handler(webRequest);
        // If Better Auth doesn't handle this route (404), fall through to next middleware
        if (webResponse.status === 404) {
            return next();
        }
        // Forward status & headers back to Express
        res.status(webResponse.status);
        webResponse.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });
        const responseText = await webResponse.text();
        res.send(responseText);
    }
    catch (err) {
        console.error("[Better Auth] handler error:", err);
        res.status(500).json({ success: false, message: "Auth service error" });
    }
});
// ---------------------------------------------------------------------------
// Other API routes
// ---------------------------------------------------------------------------
app.use("/api/users", userRoutes_1.default);
app.use("/api/courses", courseRoutes_1.default);
app.use("/api/enrollments", enrollmentRoutes_1.default);
app.use("/api/submissions", submissionRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
// ---------------------------------------------------------------------------
// Health & status endpoints
// ---------------------------------------------------------------------------
app.get("/health", (_req, res) => {
    res.json({ status: "ok", database: "connected" });
});
app.get("/api/system-status", (_req, res) => {
    res.json({
        success: true,
        server: "running",
        database: { status: "connected" },
        auth: "better-auth",
    });
});
// ---------------------------------------------------------------------------
// Bootstrap: connect to MongoDB first, then start listening
// ---------------------------------------------------------------------------
(async () => {
    await (0, db_1.connectDB)();
    // Auto-seed if database has no courses
    try {
        const { Course } = await Promise.resolve().then(() => __importStar(require("./models/Course")));
        const count = await Course.countDocuments();
        if (count === 0) {
            console.log("📦 Empty database detected. Auto-seeding initial curriculum & accounts...");
            const { seedDatabase } = await Promise.resolve().then(() => __importStar(require("./lib/seedData")));
            await seedDatabase();
            console.log("✅ Auto-seed completed successfully!");
        }
    }
    catch (err) {
        console.warn("⚠️ Auto-seed check notice:", err.message);
    }
    if (!process.env.VERCEL) {
        app.listen(port, () => {
            console.log(`\n🚀  LMS Server → http://localhost:${port}`);
            console.log(`🔐  Better Auth → http://localhost:${port}/api/auth`);
            console.log(`🩺  Health     → http://localhost:${port}/health\n`);
        });
    }
})();
exports.default = app;

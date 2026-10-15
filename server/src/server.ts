import "dotenv/config";
import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import { connectDB } from "./config/db";

import path from "path";
import fs from "fs";

// Route modules
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import courseRoutes from "./routes/courseRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";
import submissionRoutes from "./routes/submissionRoutes";
import adminRoutes from "./routes/adminRoutes";

const app: Express = express();
const port = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Favicon handling (prevents 404 on browser requests)
// ---------------------------------------------------------------------------
app.get("/favicon.ico", (_req: Request, res: Response) => {
  const faviconPath = path.join(__dirname, "../public/favicon.ico");
  if (fs.existsSync(faviconPath)) {
    res.sendFile(faviconPath);
  } else {
    res.status(204).end();
  }
});

// Serve static assets from public if present
app.use(express.static(path.join(__dirname, "../public")));

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      // Allow any localhost or 127.0.0.1 port, as well as Vercel preview URLs
      if (
        /^http:\/\/localhost(:\d+)?$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,          // Required for Better Auth session cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ---------------------------------------------------------------------------
// Serverless Database Connection Middleware
// Guarantees DB is connected before executing any route handlers on Vercel
// ---------------------------------------------------------------------------
app.use(async (req: Request, _res: Response, next: NextFunction) => {
  if (req.path === "/favicon.ico" || req.path === "/health") return next();
  try {
    await connectDB();
  } catch (err: any) {
    console.warn("[Serverless DB Init Notice]:", err.message);
  }
  next();
});

// ---------------------------------------------------------------------------
// 1. Standard Auth Routes (/api/auth/register, /api/auth/login, /api/auth/me)
// Must be mounted BEFORE Better Auth splat to prevent wildcard interception!
// ---------------------------------------------------------------------------
app.use("/api/auth", authRoutes);

// ---------------------------------------------------------------------------
// 2. Better Auth handler – mounted at /api/auth/* for Better Auth clients
// (e.g. /api/auth/sign-in/email, /api/auth/sign-up/email, /api/auth/get-session)
// ---------------------------------------------------------------------------
app.all("/api/auth/*splat", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { auth } = await import("./lib/auth");

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
    let body: BodyInit | undefined;
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
    webResponse.headers.forEach((value: string, key: string) => {
      res.setHeader(key, value);
    });

    const responseText = await webResponse.text();
    res.send(responseText);
  } catch (err: any) {
    console.error("[Better Auth] handler error:", err);
    res.status(500).json({ success: false, message: "Auth service error" });
  }
});

// ---------------------------------------------------------------------------
// Other API routes (mounted at both /api/* and root paths for maximum compatibility)
// ---------------------------------------------------------------------------
app.use("/api/users", userRoutes);
app.use("/users", userRoutes);

app.use("/api/courses", courseRoutes);
app.use("/courses", courseRoutes);

app.use("/api/enrollments", enrollmentRoutes);
app.use("/enrollments", enrollmentRoutes);

app.use("/api/submissions", submissionRoutes);
app.use("/submissions", submissionRoutes);

app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes);

// ---------------------------------------------------------------------------
// Health & status endpoints
// ---------------------------------------------------------------------------
app.get("/health", async (_req: Request, res: Response) => {
  const mongoose = (await import("mongoose")).default;
  const readyState = mongoose.connection.readyState;
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "ok",
    database: {
      status: states[readyState] || "unknown",
      readyState,
      connected: readyState === 1,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
    },
    serverless: !!process.env.VERCEL,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/system-status", async (_req: Request, res: Response) => {
  const mongoose = (await import("mongoose")).default;
  const readyState = mongoose.connection.readyState;
  res.json({
    success: true,
    server: "running",
    database: {
      status: readyState === 1 ? "connected" : "connecting/disconnected",
      readyState,
    },
    auth: "better-auth",
  });
});

// ---------------------------------------------------------------------------
// Bootstrap: connect to MongoDB first, then start listening
// ---------------------------------------------------------------------------
(async () => {
  await connectDB();

  // Auto-seed if database has no courses
  try {
    const { Course } = await import("./models/Course");
    const count = await Course.countDocuments();
    if (count === 0) {
      console.log("📦 Empty database detected. Auto-seeding initial curriculum & accounts...");
      const { seedDatabase } = await import("./lib/seedData");
      await seedDatabase();
      console.log("✅ Auto-seed completed successfully!");
    }
  } catch (err: any) {
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

export default app;
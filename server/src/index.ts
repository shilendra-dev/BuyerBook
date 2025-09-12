import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "@/config/index.js";
import { db } from "@/db/index.js";

const app = express();

// Security middleware
app.use(helmet(config.security.helmet));

// CORS configuration
app.use(cors(config.security.cors));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.security.rateLimit.max,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", async (_req, res) => {
  try {
    // Test database connection
    await db.execute("SELECT 1");
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: config.server.environment,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Database connection failed",
    });
  }
});

// API routes placeholder
app.get("/api", (_req, res) => {
  res.json({
    message: "BuyerBook API",
    version: "1.0.0",
    environment: config.server.environment,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection on startup
    await db.execute("SELECT 1");
    console.log("✅ Database connected successfully");

    app.listen(config.server.port, config.server.host, () => {
      console.log(
        `🚀 Server running on http://${config.server.host}:${config.server.port}`
      );
      console.log(`📊 Environment: ${config.server.environment}`);
      console.log(
        `🔗 Health check: http://${config.server.host}:${config.server.port}/health`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

startServer();

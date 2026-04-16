/**
 * Vercel Serverless Entry Point
 *
 * KEY NOTES for Vercel deployment:
 * - Each invocation may be a cold start — we cache the DB connection
 *   on the module-level `mongoose.connection` so warm invocations reuse it.
 * - Do NOT call app.listen() here — Vercel handles the HTTP layer.
 * - Environment variables must be set in Vercel project settings.
 * - Vercel functions have a 10s default timeout (Pro: 60s). 
 *   Keep DB queries lean and indexed.
 */

const mongoose = require("mongoose");
const app = require("../src/app");
const env = require("../src/config/env");

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(env.MONGO_URI, { autoIndex: true });
    isConnected = true;
    console.log("✅ MongoDB connected (serverless)");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    isConnected = false;
    throw err;
  }
}

// Vercel expects a default export of a Node.js request handler
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};

const mongoose = require("mongoose");
const env = require("./env");

async function connectMongo() {
  try {
    await mongoose.connect(env.MONGO_URI, {
      autoIndex: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}

module.exports = { connectMongo };

const app = require("./app");
const env = require("./config/env");
const { connectMongo } = require("./config/db.mongo");

async function startServer() {
  await connectMongo();
  app.listen(env.PORT, () => {
    console.log(`🚀 Zone Server running → http://localhost:${env.PORT}`);
    console.log(`📖 API Docs          → http://localhost:${env.PORT}/api-docs`);
    console.log(`🌍 Environment       → ${env.NODE_ENV}`);
  });
}

startServer();

require("dotenv").config();
const app = require("./app");
const { connectToDatabase } = require("./config/db");

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectToDatabase(process.env.MONGODB_URI);

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

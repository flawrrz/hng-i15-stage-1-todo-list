const mongoose = require("mongoose");

async function connectToDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }

  await mongoose.connect(mongoUri);
}

module.exports = { connectToDatabase };

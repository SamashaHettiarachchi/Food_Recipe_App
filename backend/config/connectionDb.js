const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    // Support both CONNECTION_STRING and MONGO_URI for Railway compatibility
    const mongoUri = process.env.MONGO_URI || process.env.CONNECTION_STRING;
    if (!mongoUri) {
      throw new Error("No MongoDB connection string provided");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
module.exports = connectDb;

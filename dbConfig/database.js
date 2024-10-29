// dbConfig/database.js
import mongoose from 'mongoose';

export const databaseConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

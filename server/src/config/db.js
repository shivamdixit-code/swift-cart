import mongoose from "mongoose";
import { env } from "./env.js";

let mode = "memory";

export async function connectDatabase() {
  if (!env.mongoUri) {
    console.warn("MONGODB_URI not set. Falling back to in-memory demo mode.");
    mode = "memory";
    return mode;
  }

  try {
    await mongoose.connect(env.mongoUri, { dbName: "swiftcart" });
    mode = "mongo";
    console.info("Connected to MongoDB.");
    return mode;
  } catch (error) {
    console.warn("MongoDB connection failed, using in-memory mode.", error.message);
    mode = "memory";
    return mode;
  }
}

export function getDbMode() {
  return mode;
}

import mongoose from "mongoose";
import { getEnvVar } from "../utils/getEnvVar.js";

export const initMongoConnection = async () => {
  const connectionString = getEnvVar("MONGODB_URL");
  
  try {
    await mongoose.connect(connectionString);
    console.log("Mongo connection successfully established!");
  } catch (error) {
    console.error("Error while setting up mongo connection", error);
    throw error;
  }
};
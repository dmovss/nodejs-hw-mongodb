import mongoose from "mongoose";

export const initMongoConnection = async () => {
  const { 
    MONGODB_USER, 
    MONGODB_PASSWORD, 
    MONGODB_DB,
    MONGODB_HOST
  } = process.env;

  const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString);
    console.log("Mongo connection successfully established!");
  } catch (error) {
    console.error("Error while setting up mongo connection", error);
    throw error;
  }
};
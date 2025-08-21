import mongoose from 'mongoose';

export async function connectDB() {
  const {
    MONGO_URI,
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_DB,
    MONGODB_HOST,
  } = process.env;

  const uri =
    MONGO_URI && MONGO_URI.trim()
      ? MONGO_URI
      : `mongodb+srv://${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(
          MONGODB_PASSWORD
        )}@${MONGODB_HOST}/${encodeURIComponent(
          MONGODB_DB
        )}?retryWrites=true&w=majority&appName=Cluster0`;

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('Mongo connected');
}

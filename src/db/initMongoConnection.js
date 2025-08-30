import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connection successful');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};

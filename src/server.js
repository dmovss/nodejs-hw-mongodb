const mongoose = require('mongoose');
const app = require('./app');
const { connectMongo } = require('./db/connection');
const cloudinary = require('cloudinary').v2;

const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const start = async () => {
  try {
    await connectMongo();
    console.log('Database connection successful');

    app.listen(PORT, (err) => {
      if (err) {
        console.error('Error at server launch:', err);
      }
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (err) {
    console.error(`Failed to launch application with error: ${err.message}`);
    process.exit(1);
  }
};

start();

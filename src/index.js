import dotenv from 'dotenv';
dotenv.config();

import { initMongoConnection } from "./db/initMongoConnection.js";
import app from "./server.js";

const bootstrap = async () => {
  try {
    await initMongoConnection();

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

bootstrap();

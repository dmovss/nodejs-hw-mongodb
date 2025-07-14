import app from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

const bootstrap = async () => {
  await initMongoConnection();
  
  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
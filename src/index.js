import { initMongoConnection } from './db/initMongoConnection.js';
import { startServer } from './server.js';
import dotenv from 'dotenv';

dotenv.config();

const bootstrap = async () => {
  await initMongoConnection();
  startServer();
};

bootstrap();

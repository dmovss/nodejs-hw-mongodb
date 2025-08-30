import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const startServer = () => {
  const app = express();

  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

  app.use('/api/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(errorHandler);

  const port = process.env.PORT || 3000;

  return app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

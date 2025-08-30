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

  app.get('/', (req, res) => {
    res.json({
      message: 'Contacts API is running!',
      version: '1.0.0',
      endpoints: {
        auth: {
          register: 'POST /auth/register',
          login: 'POST /auth/login',
          refresh: 'POST /auth/refresh',
          logout: 'POST /auth/logout'
        },
        contacts: {
          getAll: 'GET /api/contacts',
          getById: 'GET /api/contacts/:id',
          create: 'POST /api/contacts',
          update: 'PUT /api/contacts/:id',
          updateStatus: 'PATCH /api/contacts/:id/favorite',
          delete: 'DELETE /api/contacts/:id'
        }
      }
    });
  });

  app.use('/api/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(errorHandler);

  const port = process.env.PORT || 3000;

  return app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

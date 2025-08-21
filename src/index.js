import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import createHttpError from 'http-errors';
import { connectDB } from './lib/db.js';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

app.use((req, res, next) => {
  next(createHttpError(404, 'Not Found'));
});

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    status,
    message: err.message || 'Server error',
  });
});

const PORT = process.env.PORT || 3000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

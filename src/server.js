const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const contactsRouter = require('./routers/contacts');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

app.use('/api/contacts', contactsRouter);

// Обработка 404
app.use(notFoundHandler);

// Централизованная обработка ошибок
app.use(errorHandler);

module.exports = app;
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  if (err.code === 11000) {
    status = 409;
    message = 'Duplicate field value entered';
  }

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  }

  res.status(status).json({
    status: 'error',
    code: status,
    message,
  });
};

export { errorHandler };

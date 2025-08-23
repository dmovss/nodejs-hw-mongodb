import createHttpError from 'http-errors';

const errorHandler = (error, req, res, next) => {
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    errorMessage = error.message;
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    errorMessage = 'Invalid ID';
  } else if (error instanceof createHttpError.HttpError) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  if (error.code === 11000) {
    statusCode = 409;
    errorMessage = 'Email already exists';
  }

  console.error('Error:', error);
  res.status(statusCode).json({ error: errorMessage });
};

export default errorHandler;

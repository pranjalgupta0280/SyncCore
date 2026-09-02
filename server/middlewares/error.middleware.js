/**
 * Centralized Error Handler Middleware:
 * Express requires exactly 4 arguments (err, req, res, next) for error handling middleware.
 * Standardizes API error responses across all controllers and uncaught async rejections.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  // Handle Mongoose Duplicate Key Error (e.g. unique email or username)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    err.message = `Duplicate value entered for ${field} field. Please use another value.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    err.message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // Handle CastError (invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 404;
    err.message = `Resource not found. Invalid ${err.path}`;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : err.message,
  });
};

module.exports = errorHandler;

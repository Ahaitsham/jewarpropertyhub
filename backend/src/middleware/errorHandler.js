const { failure } = require('../utils/response');

// 404 handler — mount after all routes
function notFound(req, res) {
  return failure(res, 'Resource not found.', 404);
}

// Centralized error handler — mount last
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 'P2025') {
    return failure(res, 'Record not found.', 404);
  }
  if (err.code === 'P2002') {
    return failure(res, 'A record with this value already exists.', 409);
  }
  if (err.name === 'ZodError') {
    const message = (err.errors || [])
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(' | ') || 'Invalid input.';
    return failure(res, message, 422);
  }

  const status = err.status || 500;
  const message =
    status === 500 ? 'Something went wrong. Please try again.' : err.message;
  return failure(res, message, status);
}

module.exports = { notFound, errorHandler };

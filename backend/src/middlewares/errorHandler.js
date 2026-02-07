const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    err instanceof ApiError ? err.message : err.message || "Internal server error";

  // Always log server errors for debugging
  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error("Server error:", {
      path: req.originalUrl,
      method: req.method,
      message: err.message,
      stack: err.stack
    });
  }

  const payload = { message };
  if (err.details) {
    payload.details = err.details;
  }

  res.status(statusCode).json(payload);
};

module.exports = errorHandler;

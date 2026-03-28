export const errorHandler = (err, req, res, next) => {
  if (err.isJoi) {
    return res.status(400).json({ message: err.message });
  }

  const status = err.status || 500;
  const message = err.message || 'Unexpected server error.';
  return res.status(status).json({ message });
};

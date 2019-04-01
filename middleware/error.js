// Server error responses middleware
function serverError(err, req, res, next) {
  res.status(500).json({
    error: 'I\'m sorry, we couldn\'t retreive your data',
    message: err,
  });
  next();
}

module.exports = serverError;

const mongoose = require('mongoose');

module.exports.checkDatabaseConnection = (req, res, next) => {
  if (mongoose.connection.readyState === mongoose.STATES.connected) {
    return next();
  }
  return next(new Error(`Error establishing a database connection.`));
};

module.exports.handlePaginationRequest = (req, res, next) => {
  req.query.page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) || 1 : 1;
  req.query.limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) || 0 : 10;
  if (req.query.limit < 0 || 50 < req.query.limit) {
    req.query.limit = 10;
  }
  next();
};

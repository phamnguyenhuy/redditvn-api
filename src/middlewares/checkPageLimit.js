const { ServerError } = require('../helpers/server');
const mongoose = require('mongoose');

function checkPageLimit(req, res, next) {
  req.query.page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) || 1 : 1;
  req.query.limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) || 0 : 10;
  if (req.query.limit < 0 || 50 < req.query.limit) {
    req.query.limit = 10;
  }
  next();
}

module.exports = {
  checkPageLimit
};

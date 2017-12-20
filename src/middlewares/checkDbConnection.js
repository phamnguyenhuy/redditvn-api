const { ServerError } = require('../helpers/server');
const mongoose = require('mongoose');

function checkDbConnection(req, res, next) {
  if (mongoose.connection.readyState === mongoose.STATES.connected) {
    return next();
  }
  return next(new ServerError(`Error establishing a database connection.`));
}

module.exports = {
  checkDbConnection
};

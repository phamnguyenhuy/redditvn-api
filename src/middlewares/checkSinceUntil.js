const { ServerError } = require('../helpers/server');
const moment = require('moment');

module.exports = (req, res, next) => {
  req.query.since = typeof req.query.since === 'string' ? parseInt(req.query.since, 10) || 0 : 0;
  req.query.until = typeof req.query.until === 'string' ? parseInt(req.query.until, 10) || moment().unix() : moment().unix();

  req.query.since = moment.unix(req.query.since).toDate();
  req.query.until = moment.unix(req.query.until).toDate();

  next();
}

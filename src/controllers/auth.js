const { ServerError } = require('../helpers/server');
const { auth } = require('../services');
const { findAuthorize } = auth;

module.exports.getAuthorize = (user_id, access_token) => {
  return findAuthorize(user_id, access_token);
}

const { ServerError } = require('../helpers/server');
const { auth } = require('../services');
const { createAuthorizeFacebook, createRefreshToken } = auth;

require('../helpers/passport-strategies');

function postAuthorizeFacebook(user_id, access_token) {
  if (!user_id) throw new ServerError('user_id invalid.');
  if (!access_token) throw new ServerError('access_token invalid.');

  return createAuthorizeFacebook(user_id, access_token);
}

function getRefreshToken(user) {
  return createRefreshToken(user._id);
}

module.exports = {
  postAuthorizeFacebook,
  getRefreshToken
};

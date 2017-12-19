const { ServerError } = require('../helpers/server');
const { auth } = require('../services');
const { createAuthorizeFacebook, createRefreshToken } = auth;

require('../helpers/passport-strategies');

module.exports.postAuthorizeFacebook = (user_id, access_token) => {
  if (!user_id) throw new ServerError('user_id invalid.');
  if (!access_token) throw new ServerError('access_token invalid.');

  return createAuthorizeFacebook(user_id, access_token);
}

module.exports.getRefreshToken = user => {
  return createRefreshToken(user._id);
}

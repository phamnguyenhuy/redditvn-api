const { ServerError } = require('../helpers/server');
const FB = require('fb');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const fb = new FB.Facebook();
fb.options({ Promise: Promise });

createJwtAccessToken = user_id => {
  return jwt.sign(
    {
      user_id: user_id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d'
    }
  );
};

async function createAuthorizeFacebook(user_id, access_token) {
  // let response
  // try {
  //   response = await fb.api('me', {
  //     access_token: access_token
  //   });
  // } catch (error) {
  //   throw error;
  // }

  // // check access token have same user id
  // if (response.user_id !== user_id) {
  //   throw new ServerError('user_id and user_id in access_token invalid');
  // }

  const fb_user_id = 'fb-' + user_id;

  // create user if not exist
  let user = await User.findById(fb_user_id);
  if (!user) {
    user = new User({
      _id: fb_user_id,
      name: 'abc'
    });
    await user.save();
  }

  return createJwtAccessToken(fb_user_id);
}

async function createRefreshToken(user_id) {
  return createJwtAccessToken(user_id);
}

module.exports = {
  createAuthorizeFacebook,
  createRefreshToken
};

const { ServerError } = require('../helpers/server');
const FB = require('fb');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const fb = new FB.Facebook();
fb.options({ Promise: Promise });

module.exports.createAuthorize = async (user_id, access_token) => {
  // var response = await fb.api('access_token_info', {
  //   client_id: process.env.FACEBOOK_APP_ID,
  //   access_token: access_token
  // });

  // // check access token have same user id
  // if (response.user_id !== user_id) {
  //   return;
  // }

  // // create user if not exist
  // let user = await User.findById(user_id);
  // if (!user) {
  //   user = new User({
  //     _id: user_id,
  //     name: 'abc'
  //   });
  //   await user.save();
  // }

  // // create jwt
  // const jwt_token = jwt.sign(
  //   {
  //     user_id: user_id
  //   },
  //   process.env.JWT_SECRET,
  //   {
  //     expiresIn: '30d'
  //   }
  // );

  // // save jwt and access_token
  // await User.update(
  //   { _id: user_id },
  //   {
  //     $push: {
  //       jwt_token: jwt_token,
  //       fb_access_token: access_token
  //     }
  //   }
  // );

  // return jwt_token;
};

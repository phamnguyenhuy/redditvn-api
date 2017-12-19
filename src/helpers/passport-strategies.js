const passport = require('passport');
const passportJWT = require('passport-jwt');
const { User } = require('../models');
const { ServerError } = require('./server');

const strategy = new passportJWT.Strategy(
  {
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async (jwt_payload, next) => {
    if (!jwt_payload.user_id) {
      next(null, new ServerError('token invalid.'));
    }
    var user = await User.findById(jwt_payload.user_id).exec();
    if (user) {
      next(null, user);
    } else {
      next(null, new ServerError('not found user in database.'));
    }
  }
);

passport.use(strategy);

module.exports = passport;

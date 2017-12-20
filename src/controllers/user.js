const { ServerError } = require('../helpers/server');
const { user } = require('../services');
const { findUserById, findUsersCount, findUsersList, findUsersTop } = user;
const { facebook } = require('../services');
const { findUserPicture } = facebook;
const moment = require('moment');

async function getUserById(user_id) {
  const user = await findUserById(user_id);
  if (!user) {
    throw new ServerError('Not found user.', 404);
  }

  return {
    ...user,
    profile_pic: findUserPicture(user_id)
  };
}

async function getUsersCount() {
  return { count: await findUsersCount() };
}

function getUsersList(q, page, limit) {
  return findUsersList(q, page, limit);
}

async function getUsersTop(since, until, limit) {
  return {
    docs: await findUsersTop(since, until, limit),
    since: moment(since).unix(),
    until: moment(until).unix(),
    limit: limit
  };
}

function getUserPicture(user_id, size = 64, res) {
  res.redirect(301, findUserPicture(user_id, size));
}

module.exports = {
  getUserById,
  getUsersCount,
  getUsersList,
  getUsersTop,
  getUserPicture
};

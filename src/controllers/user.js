const { ServerError } = require('../helpers/server');
const { user } = require('../services');
const { findUserById, findUsersCount, findUsersList, findUsersTop } = user;
const moment = require('moment');

module.exports.getUserById = async user_id => {
  const user = await findUserById(user_id);
  if (!user) {
    throw new ServerError('Not found user.', 404);
  }

  return user;
};

module.exports.getUsersCount = async () => {
  return { count: await findUsersCount() };
};

module.exports.getUsersList = (q, page, limit) => {
  return findUsersList(q, page, limit);
};

module.exports.getUsersTop = async (since, until, limit) => {
  return {
    docs: await findUsersTop(since, until, limit),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
};

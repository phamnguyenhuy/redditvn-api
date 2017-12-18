const { ServerError } = require('../helpers/server');
const { user } = require('../services');
const { findUserById, findUsersCount, findUsersList, findUsersTop } = user;
const moment = require('moment');

module.exports.getUserById = user_id => {
  return findUserById(user_id);
};

module.exports.getUsersCount = async () => {
  return { count: await findUsersCount() };
};

module.exports.getUsersList = (q, page, limit) => {
  return findUsersList(q, page, limit);
};

module.exports.getUsersTop = async (since, until, limit) => {
  return {
    since: moment(since).unix(),
    until: moment(until).unix(),
    docs: await findUsersTop(since, until, limit)
  };
};

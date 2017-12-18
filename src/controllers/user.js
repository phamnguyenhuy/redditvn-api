const { ServerError } = require('../helpers/server');
const { user } = require('../services');
const { findUserById, findUsersCount, findUsersList, findUsersTop } = user;

module.exports.getUserById = (user_id) => {
  return findUserById(user_id);
}

module.exports.getUsersCount = () => {
  return findUsersCount();
}

module.exports.getUsersList = (q, page, limit) => {
  return findUsersList(q, page, limit);
}

module.exports.getUsersTop = (since, until, limit) => {
  return findUsersTop(since, until, limit);
}

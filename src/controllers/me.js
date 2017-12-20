const { ServerError } = require('../helpers/server');
const { user } = require('../services');
const { findUserSaves, insertUserSave, removeUserSave } = user;
const moment = require('moment');

const acceptCategory = ['r', 'u', 'p'];

function getSaves(user_id, category) {
  return findUserSaves(user_id, category);
}

function postSave(user_id, category, item) {
  if (!category) throw new ServerError('category invalid');
  if (!item) throw new ServerError('item invalid');
  if (!acceptCategory.includes(category)) throw new ServerError('category not accept');

  return insertUserSave(user_id, category, item);
}

function deleteSave(user_id, category, item) {
  if (!category) throw new ServerError('category invalid');
  if (!item) throw new ServerError('item invalid');

  return removeUserSave(user_id, category, item);
}

module.exports = {
  getSaves,
  postSave,
  deleteSave
};

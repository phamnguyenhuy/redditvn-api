const { ServerError } = require('../helpers/server');
const { Post, User } = require('../models');
const { regexpEscape } = require('../helpers/util');

async function findUserSaves(user_id, category) {
  let projectionCategory = 'saved';
  if (category) projectionCategory += '.' + category;
  const user = await User.findById(user_id, { [projectionCategory]: 1 });
  if (!user) throw new ServerError('not found user.');
  if (!user.saved) throw new ServerError('not found any saved.');
  if (category && !user.saved[category]) throw new ServerError(`not found category ${category}.`);
  return user;
}

async function insertUserSave(user_id, category, item) {
  const user = await User.findById(user_id, { saved: 1 });
  if (!user) throw new ServerError('not found user.');
  if (!user.saved) user.saved = {};
  if (!user.saved[category]) user.saved[category] = [];
  if (user.saved[category].includes(item)) throw new ServerError(`${item} exist in category ${category}.`);

  user.saved[category].unshift(item);
  user.markModified('saved');
  return user.save();
}

async function removeUserSave(user_id, category, item) {
  const user = await User.findById(user_id, { saved: 1 });
  if (!user) throw new ServerError('not found user.');
  if (!user.saved) throw new ServerError('not found any saved.');
  if (!user.saved[category]) throw new ServerError(`not found category ${category}.`);
  if (!user.saved[category].includes(item)) throw new ServerError(`${item} not in category ${category}.`);

  const index = user.saved[category].indexOf(item);
  if (index > -1) {
    user.saved[category].splice(index, 1);
  }
  user.markModified('saved');
  return user.save();
}

module.exports = {
  findUserSaves,
  insertUserSave,
  removeUserSave
};

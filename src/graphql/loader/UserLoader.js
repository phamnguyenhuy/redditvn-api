const DataLoader = require('dataloader');
const { User } = require('../../models');

async function batchUsers(keys) {
  return await User.find({ _id: { $in: keys } }).exec();
}

module.exports = () => new DataLoader(keys => batchUsers(keys), { cacheKeyFn: key => key.toString() });

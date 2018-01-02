const DataLoader = require('dataloader');
const { Comment } = require('../../models');

async function batchComments(keys) {
  return await Comment.find({ _id: { $in: keys } }).exec();
}

module.exports = () => new DataLoader(keys => batchComments(keys), { cacheKeyFn: key => key.toString() });

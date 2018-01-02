const DataLoader = require('dataloader');
const { Post } = require('../../models');

async function batchPosts(keys) {
  return await Post.find({ _id: { $in: keys } }).exec();
}

module.exports = () => new DataLoader(keys => batchPosts(keys), { cacheKeyFn: key => key.toString() });

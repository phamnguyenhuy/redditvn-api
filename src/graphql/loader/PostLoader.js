const DataLoader = require('dataloader');
const mongooseLoader = require('./MongooseLoader');
const { Post } = require('../../models');

module.exports.getLoader = () => new DataLoader(ids => mongooseLoader(Post, ids));

module.exports.load = async (context, id) => {
  if (!id) {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.postLoader.load(id);
  } catch (err) {
    return null;
  }
  return data;
};

module.exports.clearCache = (context, id) => {
  return context.dataloaders.postLoader.clear(id.toString());
};

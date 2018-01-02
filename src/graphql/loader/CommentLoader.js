const DataLoader = require('dataloader');
const mongooseLoader = require('./MongooseLoader');
const { Comment } = require('../../models');

module.exports.getLoader = () => new DataLoader(ids => mongooseLoader(Comment, ids));

module.exports.load = async (context, id) => {
  if (!id) {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.commentLoader.load(id);
  } catch (err) {
    return null;
  }
  return data;
};

module.exports.clearCache = (context, id) => {
  return context.dataloaders.commentLoader.clear(id.toString());
};

const DataLoader = require('dataloader');
const mongooseLoader = require('./MongooseLoader');
const connectionFromModel = require('./ConnectionFromModel');
const { Comment } = require('../../models');

const getLoader = () => new DataLoader(ids => mongooseLoader(Comment, ids));

const load = async (context, id) => {
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

const clearCache = (context, id) => {
  return context.dataloaders.commentLoader.clear(id.toString());
};

const loadComments = async (context, filter, args, orderFieldName = '_id', sortType = 1) => {
  return connectionFromModel({
    dataPromiseFunc: Comment.find.bind(Comment),
    filter: filter,
    ...args,
    orderFieldName: orderFieldName,
    sortType: sortType,
    context: context,
    loader: load
  });
};

module.exports = {
  getLoader,
  load,
  clearCache,
  loadComments
};

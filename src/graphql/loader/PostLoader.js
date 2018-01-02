const DataLoader = require('dataloader');
const mongooseLoader = require('./MongooseLoader');
const connectionFromModel = require('./ConnectionFromModel');
const { Post } = require('../../models');

const getLoader = () => new DataLoader(ids => mongooseLoader(Post, ids));

const load = async (context, id) => {
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

const clearCache = (context, id) => {
  return context.dataloaders.postLoader.clear(id.toString());
};

const loadPosts = async (context, filter, args, orderFieldName = '_id', sortType = 1) => {
  return connectionFromModel({
    dataPromiseFunc: Post.find.bind(Post),
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
  loadPosts
};

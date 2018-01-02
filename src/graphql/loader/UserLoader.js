const DataLoader = require('dataloader');
const mongooseLoader = require('./MongooseLoader');
const connectionFromModel = require('./ConnectionFromModel');
const connectionFromMongoCursor = require('./ConnectionFromMongoCursor');
const { User } = require('../../models');

const getLoader = () => new DataLoader(ids => mongooseLoader(User, ids));

const load = async (context, id) => {
  if (!id) {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.userLoader.load(id);
  } catch (err) {
    return null;
  }
  return data;
};

const clearCache = (context, id) => {
  return context.dataloaders.userLoader.clear(id.toString());
};

const loadUsers = async (context, filter, args, orderFieldName = '_id', sortType = 1) => {
  // const users = User.find(filter, { _id: 1 }).sort({ [orderFieldName]: sortType });
  // return connectionFromMongoCursor({ cursor: users, context, args, loader: load });
  return connectionFromModel({
    dataPromiseFunc: User.find.bind(User),
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
  loadUsers
};

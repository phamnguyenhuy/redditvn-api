const DataLoader = require('dataloader');
const mongooseLoader = require('./MongooseLoader');
const { User } = require('../../models');

module.exports.getLoader = () => new DataLoader(ids => mongooseLoader(User, ids));

module.exports.load = async (context, id) => {
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

module.exports.clearCache = (context, id) => {
  return context.dataloaders.userLoader.clear(id.toString());
};

// module.exports.loadUsers = async (context, args) => {
//   const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
//   const users = UserModel.find(where, { _id: 1 }).sort({ createdAt: -1 });

//   return connectionFromMongoCursor({
//     cursor: users,
//     context,
//     args,
//     loader: load,
//   });
// };

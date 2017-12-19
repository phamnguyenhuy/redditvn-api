const { ServerError } = require('../helpers/server');
const { Post, User } = require('../models');
const { regexpEscape } = require('../helpers/utils');

module.exports.findUsersCount = () => {
  return User.count({ post_count: { $gt: 0 } }).exec();
};

module.exports.findUsersTop = (since, until, limit) => {
  return Post.aggregate([
    {
      $match: {
        is_deleted: { $ne: true },
        created_time: { $gte: since, $lt: until }
      }
    },
    { $unwind: '$from' },
    {
      $group: {
        _id: '$from.id',
        name: { $first: '$from.name' },
        post_count: { $sum: 1 }
      }
    },
    { $sort: { post_count: -1 } },
    { $limit: limit }
  ]).exec();
};

module.exports.findUserById = user_id => {
  return User.findById(user_id, { _id: 1, name: 1, post_count: 1 }, { lean: true }).exec();
};

module.exports.findUsersList = (q, page, limit) => {
  const query = { post_count: { $gt: 0 } };

  if (q) {
    q = regexpEscape(q);
    query.name = { $regex: new RegExp(q), $options: 'i' };
  }

  return User.paginate(query, {
    select: { _id: 1, name: 1, post_count: 1 },
    page: page,
    limit: limit,
    sort: { post_count: -1 }
  });
};

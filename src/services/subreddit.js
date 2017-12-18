const { ServerError } = require('../helpers/server');
const { Post } = require('../models');

module.exports.findSubredditTop = (since, until, limit) => {
  return Post.aggregate([
    {
      $match: {
        is_deleted: { $ne: true },
        r: { $ne: null },
        created_time: { $gte: since, $lt: until }
      }
    },
    {
      $group: {
        _id: '$r',
        post_count: { $sum: 1 }
      }
    },
    { $sort: { post_count: -1 } },
    { $limit: limit }
  ]).exec();
};

module.exports.findSubreddits = limit => {
  return Post.aggregate([
    {
      $match: {
        is_deleted: { $ne: true },
        r: { $ne: null }
      }
    },
    {
      $group: {
        _id: '$r',
        post_count: { $sum: 1 }
      }
    },
    { $sort: { post_count: -1 } },
    { $limit: limit },
    { $project: { _id: 1 } }
  ]).exec();
};

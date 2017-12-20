const { ServerError } = require('../helpers/server');
const { Post } = require('../models');

function findSubredditTop(since, until, limit) {
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
}

function findSubreddits(since, until) {
  return Post.aggregate([
    {
      $match: {
        created_time: { $gte: since, $lt: until },
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
    { $project: { _id: 1 } }
  ]).exec();
}

module.exports = {
  findSubredditTop,
  findSubreddits
};

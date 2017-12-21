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
    { $project: { _id: 1, rLower: { $toLower: '$r' } } },
    {
      $group: {
        _id: '$rLower',
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
    { $project: { _id: 1, rLower: { $toLower: '$r' } } },
    {
      $group: {
        _id: '$rLower',
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

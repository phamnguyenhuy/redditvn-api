const { ServerError } = require('../helpers/server');
const { Post } = require('../models');

function findSubredditTop(since, until, first) {
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
        posts_count: { $sum: 1 }
      }
    },
    { $sort: { posts_count: -1 } },
    { $limit: first }
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
        posts_count: { $sum: 1 }
      }
    },
    { $sort: { posts_count: -1 } },
    { $project: { _id: 1 } }
  ]).exec();
}

function findSubredditsCount(since, until) {
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
        _id: '$rLower'
      }
    }
  ]).exec();
}

module.exports = {
  findSubredditTop,
  findSubreddits,
  findSubredditsCount
};

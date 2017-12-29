const moment = require('moment');
const git = require('git-last-commit');

const getProjection = require('../getProjection');

const { Post, Comment, User } = require('../../models');

const { subreddit } = require('../../services');
const { findSubredditsCount } = subreddit;

const { setting } = require('../../services');
const { findLastUpdated } = setting;

const { stats } = require('../../services');
const { findStatsChart } = stats;

const QueryResolver = {
  Query: {
    async count(root, { type, since, until }, context, { cacheControl }) {
      if (cacheControl) cacheControl.setCacheHint({ maxAge: 60 });
      since = moment.unix(since).toDate();
      until = moment.unix(until).toDate();

      switch (type) {
        case 'POSTS':
          return Post.count({
            created_time: {
              $gte: since,
              $lt: until
            },
            is_deleted: { $ne: true }
          }).exec();
        case 'LIKES':
          const likes = await Post.aggregate([
            {
              $match: {
                is_deleted: { $ne: true },
                created_time: { $gte: since, $lt: until }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: '$likes_count' }
              }
            }
          ]).exec();
          return likes[0].count;
        case 'COMMENTS':
          return Comment.count({ created_time: { $gte: since, $lt: until } }).exec();
        case 'USERS':
          return User.count({ posts_count: { $gt: 0 } }).exec();
        case 'SUBREDDITS':
          const src = await findSubredditsCount(since, until);
          return src.length;
        default:
          return null;
      }
    },
    chart(root, { type, group }, context, info) {
      return findStatsChart(type, group);
    },
    async lastUpdated(root, args, context, info) {
      return (await findLastUpdated()).value;
    },
    async version(root, args, context, info) {
      const commit = await new Promise((resolve, reject) => {
        git.getLastCommit(function(err, commit) {
          if (err) {
            return reject(err);
          }
          return resolve(commit);
        });
      });
      return `[${commit.shortHash}] ${commit.subject}`;
    }
  }
};

module.exports = QueryResolver;

const moment = require('moment');
const _ = require('lodash');
const git = require('git-last-commit');
const { fromGlobalId } = require('graphql-relay');

const { Post, Comment, User } = require('../../models');

const { subreddit } = require('../../services');
const { findSubredditsCount } = subreddit;

const { setting } = require('../../services');
const { findLastUpdated } = setting;

const { stats } = require('../../services');
const { findStatsChart } = stats;

const QueryResolver = {
  Node: {
    __resolveType(data) {
      if (data instanceof Post) return 'Post';
      if (data instanceof Comment) return 'Comment';
      if (data instanceof User) return 'User';
      return data.__typename || data.typename.name;
    }
  },
  Query: {
    async node(root, { id }, context, info) {
      const globalID = fromGlobalId(id);
      switch (globalID.type) {
        case 'Post':
          return Post.findById(globalID.id).exec();
        case 'User':
          return User.findById(globalID.id).exec();
        case 'Comment':
          return Comment.findById(globalID.id).exec();

        default:
          return null;
      }
    },
    async nodes(root, { ids }, context, info) {
      const globalIDs = ids.map(value => fromGlobalId(value));
      const postIDs = globalIDs.filter(value => value.type === 'Post').map(value => value.id);
      const userIDs = globalIDs.filter(value => value.type === 'User').map(value => value.id);
      const commentIDs = globalIDs.filter(value => value.type === 'Comment').map(value => value.id);

      const posts = await Post.find({ _id: { $in: postIDs } }).exec();
      const users = await User.find({ _id: { $in: userIDs } }).exec();
      const comments = await Comment.find({ _id: { $in: commentIDs } }).exec();

      return [...posts, ...users, ...comments];
    },
    async count(root, { type, since, until }, context, { cacheControl }) {
      if (cacheControl) cacheControl.setCacheHint({ maxAge: 60 });

      switch (type) {
        case 'POSTS': {
          const filter = {
            is_deleted: { $ne: true }
          };
          if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
          if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());

          return Post.count(filter).exec();
        }

        case 'LIKES': {
          const filter = {
            is_deleted: { $ne: true }
          };
          if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
          if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
          const likes = await Post.aggregate([{ $match: filter }, { $group: { _id: null, count: { $sum: '$likes_count' } } }]).exec();
          return likes[0].count;
        }
        case 'COMMENTS': {
          const filter = {};
          if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
          if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
          return Comment.count(filter).exec();
        }

        case 'USERS':
          return User.count().exec();

        case 'USERS_POSTS':
          return User.count({ posts_count: { $gt: 0 } }).exec();

        case 'USERS_COMMENTS':
          return User.count({ comments_count: { $gt: 0 } }).exec();

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

const connectionFromModel = require('../connectionFromModel');
const { User, Post } = require('../../models');
const moment = require('moment');

const { subreddit } = require('../../services');
const { findSubredditTop } = subreddit;

const getProjection = require('../getProjection');

const TopResolver = {
  Query: {
    top(root, args, context, info) {
      return {};
    }
  },
  Top: {
    likes(top, { since, until, first, last, before, after }, context, info) {
      since = moment.unix(since).toDate();
      until = moment.unix(until).toDate();
      const filter = {
        created_time: { $gte: since, $lt: until },
        is_deleted: { $ne: true }
      };
      return connectionFromModel(Post, filter, { first, last, before, after }, 'likes_count', -1);
    },
    comments(top, { since, until, first, last, before, after }, context, info) {
      since = moment.unix(since).toDate();
      until = moment.unix(until).toDate();
      const filter = {
        created_time: { $gte: since, $lt: until },
        is_deleted: { $ne: true }
      };
      return connectionFromModel(Post, filter, { first, last, before, after }, 'comments_count', -1);
    },
    async posts_count(top, { since, until, first }, context, info) {
      since = moment.unix(since).toDate();
      until = moment.unix(until).toDate();
      const list = await Post.aggregate([
        {
          $match: {
            is_deleted: { $ne: true },
            created_time: { $gte: since, $lt: until }
          }
        },
        {
          $group: {
            _id: '$user',
            posts_count: { $sum: 1 }
          }
        },
        { $sort: { posts_count: -1 } },
        { $limit: first }
      ]).exec();
      const edges = await Promise.all(
        list.map(async value => {
          const user = await User.findById(value._id).exec();
          user.posts_count = value.posts_count;
          return user;
        })
      );
      return {
        edges: edges,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    },
    async subreddit(top, { since, until, first }, context, info) {
      since = moment.unix(since).toDate();
      until = moment.unix(until).toDate();
      return {
        edges: await findSubredditTop(since, until, first),
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    }
  }
};

module.exports = TopResolver;

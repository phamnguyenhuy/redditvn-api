const connectionFromModel = require('../connectionFromModel');
const { User, Post } = require('../../models');
const moment = require('moment');

const { subreddit } = require('../../services');
const { findSubredditTop } = subreddit;

const getProjection = require('../getProjection');
const _ = require('lodash');

const TopResolver = {
  Query: {
    top(root, args, context, info) {
      return {};
    }
  },
  Top: {
    likes(top, { since, until, first, last, before, after }, context, info) {
      const filter = {
        is_deleted: { $ne: true }
      };
      if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
      if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
      return connectionFromModel({
        dataPromiseFunc: Post.find.bind(Post),
        filter,
        after,
        before,
        first,
        last,
        orderFieldName: 'likes_count',
        sortType: -1
      });
    },
    comments(top, { since, until, first, last, before, after }, context, info) {
      const filter = {
        is_deleted: { $ne: true }
      };
      if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
      if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
      return connectionFromModel({
        dataPromiseFunc: Post.find.bind(Post),
        filter,
        after,
        before,
        first,
        last,
        orderFieldName: 'comments_count',
        sortType: -1
      });
    },
    async posts_count(top, { since, until, first }, context, info) {
      const filter = {
        is_deleted: { $ne: true }
      };
      if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
      if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
      const list = await Post.aggregate([
        { $match: filter },
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
          return {
            cursor: new Buffer(value._id).toString('base64'),
            node: user
          };
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

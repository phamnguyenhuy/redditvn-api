const moment = require('moment');
const getProjection = require('../getProjection');
const connectionFromModel = require('../connectionFromModel');
const { Post, Comment, User } = require('../../models');
const { regexpEscape } = require('../../helpers/util');

const { facebook } = require('../../services');
const { findAttachmentsByPostId } = facebook;
const _ = require('lodash');

const PostResolver = {
  Query: {
    post(root, { id }, context, info) {
      const projection = getProjection(info.fieldNodes[0]);
      return Post.findById(id, projection).exec();
    },
    posts(root, { first, last, before, after, since, until, r, q, u, user }, context, info) {
      const filter = {
        is_deleted: { $ne: true }
      };
      if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
      if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
      if (r) filter.r = { $regex: `^${r}$`, $options: 'i' };
      if (u) filter.u = { $regex: `^${u}$`, $options: 'i' };
      if (q) {
        if (q.startsWith('regex:')) q = q.substr(6);
        else q = regexpEscape(q);
        filter.message = { $regex: new RegExp(q), $options: 'i' };
      }
      user ? (filter.user = user) : undefined;

      return connectionFromModel({
        dataPromiseFunc: Post.find.bind(Post),
        filter,
        after,
        before,
        first,
        last,
        orderFieldName: 'created_time',
        sortType: -1
      });
    },
    async random(root, { r, q }, context, info) {
      const filter = {};
      r ? (filter.r = { $regex: `^${r}$`, $options: 'i' }) : undefined;
      if (q) {
        if (q.startsWith('regex:')) q = q.substr(6);
        else q = regexpEscape(q);
        filter.message = { $regex: new RegExp(q), $options: 'i' };
      }

      const count = await Post.count(filter);
      const random = Math.floor(Math.random() * count);
      return Post.findOne(filter)
        .skip(random)
        .exec();
    }
  },
  Post: {
    message(post, { limit }, context, info) {
      if (limit) return post.message.substr(0, limit);
      return post.message;
    },
    user(post, args, context, info) {
      const projection = getProjection(info.fieldNodes[0]);
      return User.findById(post.user, projection).exec();
    },
    async attachments(post, args, context, info) {
      try {
        return {
          edges: await findAttachmentsByPostId(post._id),
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          }
        };
      } catch (error) {
        return null;
      }
    },
    comments(post, { since, until, first, last, before, after }, context, info) {
      const filter = {
        post: post._id,
        parent: { $eq: null }
      };
      if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
      if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
      return connectionFromModel({
        dataPromiseFunc: Comment.find.bind(Comment),
        filter,
        after,
        before,
        first,
        last,
        orderFieldName: 'created_time',
        sortType: 1
      });
    }
  }
};

module.exports = PostResolver;

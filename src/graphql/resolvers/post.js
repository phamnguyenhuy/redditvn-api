const moment = require('moment');
const connectionFromModel = require('../loader/ConnectionFromModel');
const { Post, Comment, User } = require('../../models');
const { regexpEscape } = require('../../helpers/util');
const { toGlobalId } = require('graphql-relay');
const { facebook } = require('../../services');
const { findAttachmentsByPostId } = facebook;
const _ = require('lodash');
const { userLoader, postLoader, commentLoader } = require('../loader');
const { buildPostFilters, buildCommentFilters } = require('../../helpers/filterBuilder');
const { orderByPostBuilder } = require('../../helpers/orderByBuilder');

const PostResolver = {
  Query: {
    posts(root, { filter, orderBy, first, last, before, after }, context, info) {
      const buildFilters = filter ? buildPostFilters(filter) : []
      const postFilters = buildFilters.length > 0 ? { $or: buildFilters } : { is_deleted: { $ne: true } };

      const ob = orderByPostBuilder(orderBy);

      return postLoader.loadPosts(context, postFilters, { first, last, before, after }, ob.orderFieldName, ob.sortType);
    },
    async random(root, { filter }, context, info) {
      const buildFilters = filter ? buildPostFilters(filter) : []
      const postFilters = buildFilters.length > 0 ? { $or: buildFilters } : { is_deleted: { $ne: true } };

      const count = await Post.count(postFilters);
      const random = Math.floor(Math.random() * count);
      return Post.findOne(postFilters)
        .skip(random)
        .exec();
    }
  },
  Post: {
    __isTypeOf(post, args, context, info) {
      return post instanceof Post;
    },
    id(post, args, context, info) {
      return toGlobalId('Post', post._id);
    },
    message(post, { limit }, context, info) {
      if (limit) return post.message.substr(0, limit);
      return post.message;
    },
    user(post, args, context, info) {
      return userLoader.load(context, post.user);
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
      _.set(filter, 'post', post._id);
      _.set(filter, 'parent', { $eq: null });

      const buildFilters = filter ? buildCommentFilters(filter) : []
      const commentFilters = buildFilters.length > 0 ? { $or: buildFilters } : { user: user._id };

      return commentLoader.loadComments(context, commentFilters, { first, last, before, after }, 'created_time', 1);
    }
  }
};

module.exports = PostResolver;

const moment = require('moment');
const connectionFromModel = require('../loader/ConnectionFromModel');
const { Post, Comment, User } = require('../../models');
const { regexpEscape } = require('../../helpers/util');
const { toGlobalId } = require('graphql-relay');
const { facebook } = require('../../services');
const { findAttachmentsByPostId } = facebook;
const _ = require('lodash');
const { userLoader, postLoader, commentLoader } = require('../loader');

function buildPostFilters({ OR = [], since, until, r, q, u, user }) {
  const filter = since || until || r || q || u || user ? { is_deleted: { $ne: true } } : null;

  if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
  if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
  if (r) filter.r = { $regex: `^${r}$`, $options: 'i' };
  if (u) filter.u = { $regex: `^${u}$`, $options: 'i' };
  if (q) {
    if (q.startsWith('regex:')) q = q.substr(6);
    else q = regexpEscape(q);
    filter.message = { $regex: new RegExp(q), $options: 'i' };
  }
  if (user) filter.user = user;

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildPostFilters(OR[i]));
  }
  return filters;
}

const PostResolver = {
  Query: {
    posts(root, { filter, first, last, before, after }, context, info) {
      const postFilters = filter ? { $or: buildPostFilters(filter) } : { is_deleted: { $ne: true } };
      return postLoader.loadPosts(context, postFilters, { first, last, before, after }, 'created_time', -1);
      // return connectionFromModel({
      //   dataPromiseFunc: Post.find.bind(Post),
      //   filter: postFilters,
      //   after,
      //   before,
      //   first,
      //   last,
      //   orderFieldName: 'created_time',
      //   sortType: -1
      // });
    },
    async random(root, { filter }, context, info) {
      const postFilters = filter ? { $or: buildPostFilters(filter) } : { is_deleted: { $ne: true } };
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
      const filter = {
        post: post._id,
        parent: { $eq: null }
      };
      if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
      if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
      return commentLoader.loadComments(context, filter, { first, last, before, after }, 'created_time', 1);
      // return connectionFromModel({
      //   dataPromiseFunc: Comment.find.bind(Comment),
      //   filter,
      //   after,
      //   before,
      //   first,
      //   last,
      //   orderFieldName: 'created_time',
      //   sortType: 1
      // });
    }
  }
};

module.exports = PostResolver;

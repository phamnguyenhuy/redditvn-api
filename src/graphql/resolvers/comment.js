const moment = require('moment');
const { Comment } = require('../../models');
const connectionFromModel = require('../loader/ConnectionFromModel');
const _ = require('lodash');
const { toGlobalId } = require('graphql-relay');
const { postLoader, commentLoader, userLoader } = require('../loader');
const { buildCommentFilters } = require('../../helpers/filterBuilder');

const CommentResolver = {
  Comment: {
    __isTypeOf(comment, args, context, info) {
      return comment instanceof Comment;
    },
    id(comment, args, context, info) {
      return toGlobalId('Comment', comment._id);
    },
    post(comment, args, context, info) {
      return postLoader.load(context, comment.post);
    },
    user(comment, args, context, info) {
      return userLoader.load(context, comment.user);
    },
    parent(comment, args, context, info) {
      if (!comment.parent) return null;
      return commentLoader.load(context, comment.parent);
    },
    replies(comment, { filter, first, last, before, after }, context, info) {
      _.set(filter, 'parent', comment._id);

      const buildFilters = filter ? buildCommentFilters(filter) : []
      const commentFilters = buildFilters.length > 0 ? { $or: buildFilters } : { user: user._id };

      return commentLoader.loadComments(context, commentFilters, { first, last, before, after }, 'created_time', 1);
    }
  }
};

module.exports = CommentResolver;

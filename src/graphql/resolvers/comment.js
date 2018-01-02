const moment = require('moment');
const { Comment } = require('../../models');
const connectionFromModel = require('../connectionFromModel');
const _ = require('lodash');
const { toGlobalId } = require('graphql-relay');
const { postLoader, commentLoader, userLoader } = require('../loader')

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
    replies(comment, { since, until, first, last, before, after }, context, info) {
      const filter = {
        parent: comment._id
      };
      if (since) {
        _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
      }
      if (until) {
        _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
      }
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

module.exports = CommentResolver;

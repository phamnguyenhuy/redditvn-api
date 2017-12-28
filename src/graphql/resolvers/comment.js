const moment = require('moment');
const getProjection = require('../getProjection');
const { Post, Comment, User } = require('../../models');
const connectionFromModel = require('../connectionFromModel');

const CommentResolver = {
  Query: {
    comment(root, { id }, context, info) {
      const projection = getProjection(info.fieldNodes[0]);
      return Comment.findById(id, projection).exec();
    }
  },
  CommentConnection: {
    edges(connection) {
      if (connection.query) return connection.query.toArray();
      if (connection.edges) return connection.edges;
      return null;
    }
  },
  CommentEdge: {
    cursor(comment) {
      return { value: comment._id.toString() };
    },
    node(comment) {
      return comment;
    }
  },
  Comment: {
    post(comment, args, context, info) {
      const projection = getProjection(info.fieldNodes[0]);
      return Post.findById(comment.post, projection).exec();
    },
    user(comment, args, context, info) {
      const projection = getProjection(info.fieldNodes[0]);
      return User.findById(comment.user, projection).exec();
    },
    parent(comment, args, context, info) {
      if (!comment.parent) return null;
      const projection = getProjection(info.fieldNodes[0]);
      return Comment.findById(comment.parent, projection).exec();
    },
    replies(comment, { since, until, first, last, before, after }, context, info) {
      const filter = {
        parent: comment._id
      };
      if (since) {
        filter.created_time = filter.created_time || {};
        filter.created_time.$gte = moment.unix(since).toDate();
      }
      if (until) {
        filter.created_time = filter.created_time || {};
        filter.created_time.$lt = moment.unix(until).toDate();
      }
      return connectionFromModel(Comment, filter, { first, last, before, after }, 'created_time', 1);
    }
  }
};

module.exports = CommentResolver;

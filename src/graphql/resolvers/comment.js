const getProjection = require('../getProjection');
const { Post, Comment, User } = require('../../models');
const { comment } = require('../../services');
const { findCommentsByPostId } = comment;

const CommentResolver = {
  Query: {
    comment(obj, { id }, context, info) {
      const projection = getProjection(info.fieldNodes[0]);
      return Comment.findById(id, projection).exec();
    },
    comments(obj, { post_id, since, until, page, limit }, context, info) {
      return findCommentsByPostId(post_id, since, until, page, limit);
    },
  },
  Comment: {
    _id(comment, args, context, info) {
      return comment._id;
    },
    async post(comment, args, context, info) {
      const projection = getProjection(info.fieldNodes[0]);
      const post_id = comment.post;
      const post = await Post.findById(post_id, projection).exec();
      return post;
    },
    async user(comment, args, context, info) {
      const projection = getProjection(info.fieldNodes[0]);
      const user_id = comment.user;
      const user = await User.findById(user_id, projection).exec();
      return user;
    },
    async parent(comment, args, context, info) {
      if (!comment.parent) return null;
      const projection = getProjection(info.fieldNodes[0]);
      const parent_id = comment.parent;
      const parent_comment = await Comment.findById(parent_id, projection).exec();
      return parent_comment;
    },
    message(comment, args, context, info) {
      return comment.message;
    },
    created_time(comment, args, context, info) {
      return comment.created_time;
    }
  }
}

module.exports = CommentResolver;

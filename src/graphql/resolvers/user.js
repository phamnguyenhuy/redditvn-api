const getProjection = require('../getProjection');
const { Post, User, Comment } = require('../../models');
const connectionFromModel = require('../connectionFromModel');
const { regexpEscape } = require('../../helpers/util');

const UserResolver = {
  Query: {
    user(root, { id }, context, info) {
      const projection = getProjection(info.fieldNodes[0]);
      return User.findById(id, projection).exec();
    },
    async users(root, { q, first, last, before, after }, context, info) {
      const filter = { posts_count: { $gt: 0 } };
      if (q) {
        q = regexpEscape(q);
        filter.name = { $regex: new RegExp(q), $options: 'i' };
      }
      return connectionFromModel({
        dataPromiseFunc: User.find.bind(User),
        filter,
        after,
        before,
        first,
        last,
        orderFieldName: 'posts_count',
        sortType: -1
      });
    }
  },
  User: {
    profile_pic(user, { size }, context, info) {
      return `https://graph.facebook.com/${user._id}/picture?type=square&redirect=true&width=${size}&height=${size}`;
    },
    posts(user, { first, last, before, after }, context, info) {
      const filter = { user: user._id };
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
    async comments(user, { first, last, before, after }, context, info) {
      const filter = { user: user._id };
      return connectionFromModel({
        dataPromiseFunc: Comment.find.bind(Comment),
        filter,
        after,
        before,
        first,
        last,
        orderFieldName: 'created_time',
        sortType: -1
      });
    }
  }
};

module.exports = UserResolver;

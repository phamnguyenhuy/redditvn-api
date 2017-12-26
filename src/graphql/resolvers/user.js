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
      return connectionFromModel(User, filter, { first, last, before, after }, 'posts_count', -1);
    }
  },
  UserConnection: {
    edges(connection) {
      if (connection.query) return connection.query.toArray();
      if (connection.edges) return connection.edges;
      return null;
    }
  },
  UserEdge: {
    cursor(user) {
      return { value: user._id.toString() };
    },
    node(user) {
      return user;
    }
  },
  User: {
    profile_pic(user, { size }, context, info) {
      size = size || 64;
      return `https://graph.facebook.com/${user._id}/picture?type=square&redirect=true&width=${size}&height=${size}`;
    },
    posts(user, { first, last, before, after }, context, info) {
      const filter = { user: user._id };
      return connectionFromModel(Post, filter, { first, last, before, after }, 'created_time', -1);
    },
    comments(user, { first, last, before, after }, context, info) {
      const filter = { user: user._id };
      return connectionFromModel(Comment, filter, { first, last, before, after }, 'created_time', -1);
    }
  }
};

module.exports = UserResolver;

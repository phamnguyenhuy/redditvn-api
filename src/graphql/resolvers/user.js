const getProjection = require('../getProjection');
const { Post, User } = require('../../models');

const { user } = require('../../services');
const { findUsersList } = user;

const UserResolver = {
  Query: {
    user(obj, { id }, context, info) {
      const projection = getProjection(info.fieldNodes[0]);
      return User.findById(id, projection).exec();
    },
    async users(obj, { q, page, limit }, context, info) {
      return (await findUsersList(q, page, limit)).docs;
    }
  },
  User: {
    _id(user, args, context, info) {
      return user._id;
    },
    name(user, args, context, info) {
      return user.name;
    },
    profile_pic(user, { size }, context, info) {
      size = size || 64;
      return `https://graph.facebook.com/${user._id}/picture?type=square&redirect=true&width=${size}&height=${size}`;
    },
    posts_count(user, args, context, info) {
      return user.posts_count;
    },
    comments_count(user, args, context, info) {
      return user.comments_count;
    },
    async posts(user, { limit }, context, info) {
      limit = limit || 10;
      const posts = await Post.find({
        'user': user._id
      })
        .limit(limit)
        .exec();
      return posts;
    }
  }
}

module.exports = UserResolver;

const { Post, User, Comment } = require('../../models');
const connectionFromModel = require('../loader/ConnectionFromModel');
const { regexpEscape } = require('../../helpers/util');
const { toGlobalId } = require('graphql-relay');
const { userLoader, postLoader, commentLoader } = require('../loader');

function buildUserFilters({ OR = [], q }) {
  const filter = q ? { posts_count: { $gt: 0 } } : null;

  if (q) filter.name = { $regex: new RegExp(regexpEscape(q)), $options: 'i' };

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildUserFilters(OR[i]));
  }
  return filters;
}

const UserResolver = {
  Query: {
    users(root, { filter, first, last, before, after }, context, info) {
      const userFilters = filter ? { $or: buildUserFilters(filter) } : { posts_count: { $gt: 0 } };
      return userLoader.loadUsers(context, userFilters, { first, last, before, after }, 'posts_count', -1);
      // return connectionFromModel({
      //   dataPromiseFunc: User.find.bind(User),
      //   filter: userFilters,
      //   after,
      //   before,
      //   first,
      //   last,
      //   orderFieldName: 'posts_count',
      //   sortType: -1
      // });
    }
  },
  User: {
    __isTypeOf(user, args, context, info) {
      return user instanceof User;
    },
    id(user, args, context, info) {
      return toGlobalId('User', user._id);
    },
    profile_pic(user, { size }, context, info) {
      return `https://graph.facebook.com/${user._id}/picture?type=square&redirect=true&width=${size}&height=${size}`;
    },
    posts(user, { first, last, before, after }, context, info) {
      const filter = { user: user._id };
      return postLoader.loadPosts(context, filter, { first, last, before, after }, 'created_time', -1);
      // return connectionFromModel({
      //   dataPromiseFunc: Post.find.bind(Post),
      //   filter,
      //   after,
      //   before,
      //   first,
      //   last,
      //   orderFieldName: 'created_time',
      //   sortType: -1
      // });
    },
    async comments(user, { first, last, before, after }, context, info) {
      const filter = { user: user._id };
      return commentLoader.loadComments(context, filter, { first, last, before, after }, 'created_time', -1);
      // return connectionFromModel({
      //   dataPromiseFunc: Comment.find.bind(Comment),
      //   filter,
      //   after,
      //   before,
      //   first,
      //   last,
      //   orderFieldName: 'created_time',
      //   sortType: -1
      // });
    }
  }
};

module.exports = UserResolver;

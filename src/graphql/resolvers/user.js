const { Post, User, Comment } = require('../../models');
const connectionFromModel = require('../loader/ConnectionFromModel');
const { regexpEscape } = require('../../helpers/util');
const { toGlobalId } = require('graphql-relay');
const { userLoader, postLoader, commentLoader } = require('../loader');
const snoowrap = require('snoowrap');

function buildUserFilters({ OR = [], q }) {
  const filter = q ? { posts_count: { $gt: 0 } } : null;

  if (filter) {
    if (q) filter.name = { $regex: new RegExp(regexpEscape(q)), $options: 'i' };
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildUserFilters(OR[i]));
  }
  return filters;
}

const UserResolver = {
  Query: {
    users(root, { filter, orderBy, first, last, before, after }, context, info) {
      const buildFilters = filter ? buildUserFilters(filter) : []
      const userFilters = (filter && buildFilters.length > 0) ? { $or: buildFilters } : { posts_count: { $gt: 0 } };

      let orderFieldName = 'posts_count';
      let sortType = -1;
      if (orderBy) {
        const lastDash = orderBy.lastIndexOf('_');
        orderFieldName = orderBy.substr(0, lastDash);
        sortType = orderBy.substr(lastDash + 1) === 'ASC' ? 1 : -1;
      }

      return userLoader.loadUsers(context, userFilters, { first, last, before, after }, orderFieldName, sortType);
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
  U: {
    __isTypeOf(u, args, context, info) {
      return u instanceof snoowrap.objects.RedditUser;
    },
    id(u, args, context, info) {
      return toGlobalId('U', u.name);
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

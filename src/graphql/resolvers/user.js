const { Post, User, Comment } = require('../../models');
const connectionFromModel = require('../loader/ConnectionFromModel');
const { regexpEscape } = require('../../helpers/util');
const { toGlobalId } = require('graphql-relay');
const { userLoader, postLoader, commentLoader } = require('../loader');
const snoowrap = require('snoowrap');
const { buildUserFilters, buildPostFilters, buildCommentFilters } = require('../../helpers/filterBuilder');
const { orderByUserBuilder, orderByPostBuilder } = require('../../helpers/orderByBuilder');
const _ = require('lodash');

const UserResolver = {
  Query: {
    users(root, { filter, orderBy, first, last, before, after }, context, info) {
      const buildFilters = filter ? buildUserFilters(filter) : []
      const userFilters = (filter && buildFilters.length > 0) ? { $or: buildFilters } : { posts_count: { $gt: 0 } };

      const ob = orderByUserBuilder(orderBy);

      return userLoader.loadUsers(context, userFilters, { first, last, before, after }, ob.orderFieldName, ob.sortType);
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
    posts(user, { filter, orderBy, first, last, before, after }, context, info) {
      _.set(filter, 'user', user._id);

      const buildFilters = filter ? buildPostFilters(filter) : []
      const postFilters = (filter && buildFilters.length > 0) ? { $or: buildFilters } : { user: user._id };

      const ob = orderByPostBuilder(orderBy);

      return postLoader.loadPosts(context, postFilters, { first, last, before, after }, ob.orderFieldName, ob.sortType);

    },
    async comments(user, { filter, first, last, before, after }, context, info) {
      _.set(filter, 'user', user._id);

      const buildFilters = filter ? buildCommentFilters(filter) : []
      const commentFilters = (filter && buildFilters.length > 0) ? { $or: buildFilters } : { user: user._id };

      return commentLoader.loadComments(context, commentFilters, { first, last, before, after }, 'created_time', -1);
    }
  }
};

module.exports = UserResolver;

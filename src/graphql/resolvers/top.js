const { User } = require('../../models');

const { post } = require('../../services');
const { findPostsOrderByLikes, findPostsOrderByComments } = post;

const { user } = require('../../services');
const { findUsersTop } = user;

const { subreddit } = require('../../services');
const { findSubredditTop } = subreddit;

const getProjection = require('../getProjection');

const TopResolver = {
  UserTopResult: {
    user(obj, args, context, info) {
      const projection = getProjection(info.fieldNodes[0]);
      return User.findById(obj._id, projection);
    },
    posts_count(obj, args, context, info) {
      return obj.posts_count;
    }
  },
  Top: {
    likes({ since, until, limit }, args, context, info) {
      return findPostsOrderByLikes(since, until, limit);
    },
    commentes({ since, until, limit }, args, context, info) {
      return findPostsOrderByComments(since, until, limit);
    },
    user_posts({ since, until, limit }, args, context, info) {
      return findUsersTop(since, until, limit);
    },
    subreddit({ since, until, limit }, args, context, info) {
      return findSubredditTop(since, until, limit);
    }
  }
}

module.exports = TopResolver;

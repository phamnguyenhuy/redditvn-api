const { Post, Comment, User } = require('../../models');
const moment = require('moment');
const { subreddit } = require('../../services');
const { findSubreddits } = subreddit;
const { toGlobalId } = require('graphql-relay');
const snoowrap = require('snoowrap');

const SubRedditResolver = {
  Query: {
    async subreddits(root, { since, until }, context, info) {
      return (await findSubreddits(since, until)).map(r => r._id);
    }
  },
  SubRedditEdge: {
    cursor(subreddit) {
      return { value: subreddit._id.toString() };
    },
    node(subreddit) {
      return subreddit;
    }
  },
  R: {
    __isTypeOf(r, args, context, info) {
      return r instanceof snoowrap.objects.Subreddit;
    },
    id(r, args, context, info) {
      return toGlobalId('U', r.display_name);
    }
  }
};

module.exports = SubRedditResolver;

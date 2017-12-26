const getProjection = require('../getProjection');
const { Post, Comment, User } = require('../../models');
const moment = require('moment');
const { subreddit } = require('../../services');
const { findSubreddits } = subreddit;

const SubRedditResolver = {
  Query: {
    async subreddits(root, { since, until }, context, info) {
      since = moment.unix(since).toDate();
      until = moment.unix(until).toDate();
      return (await findSubreddits(since, until)).map(r => r._id);
    }
  },
  SubRedditConnection: {},
  SubRedditEdge: {
    cursor(subreddit) {
      return { value: subreddit._id.toString() };
    },
    node(subreddit) {
      return subreddit;
    }
  },
  SubReddit: {}
};

module.exports = SubRedditResolver;

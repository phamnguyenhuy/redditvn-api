const getProjection = require('../getProjection');
const { Post, Comment, User } = require('../../models');
const moment = require('moment');
const { subreddit } = require('../../services');
const { findSubreddits } = subreddit;
const snoowrap = require('snoowrap');

let r;
if (process.env.REDDIT_USER_AGENT && process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET) {
  if (process.env.REDDIT_REFRESH_TOKEN) {
    r = new snoowrap({
      userAgent: process.env.REDDIT_USER_AGENT,
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      refreshToken: process.env.REDDIT_REFRESH_TOKEN
    });
  }
  else if (process.env.REDDIT_USERNAME && process.env.REDDIT_PASSWORD) {
    r = new snoowrap({
      userAgent: process.env.REDDIT_USER_AGENT,
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD
    });
  }
}

const SubRedditResolver = {
  Query: {
    async subreddits(root, { since, until }, context, info) {
      since = moment.unix(since).toDate();
      until = moment.unix(until).toDate();
      return (await findSubreddits(since, until)).map(r => r._id);
    },
    async r(root, { displayName }, context, info) {
      if (!r) throw Error('Reddit API not config.')
      return await r.getSubreddit(displayName).fetch();
    },
    async u(root, { name }, context, info) {
      if (!r) throw Error('Reddit API not config.')
      return await r.getUser(name).fetch();
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

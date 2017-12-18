const { ServerError } = require('../helpers/server');
const moment = require('moment');
const { subreddit } = require('../services');
const { findSubreddits, findSubredditTop } = subreddit;

module.exports.getSubreddits = async (since, until) => {
  return {
    docs: (await findSubreddits()).map(r => r._id),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
};

module.exports.getSubredditTop = async (since, until, limit) => {
  return {
    docs: await findSubredditTop(since, until, limit),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
};

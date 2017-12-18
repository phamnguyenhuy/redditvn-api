const { ServerError } = require('../helpers/server');
const { subreddit } = require('../services');
const { findSubreddits, findSubredditTop } = subreddit;

module.exports.getSubreddits = (limit) => {
  return findSubreddits(limit);
}

module.exports.getSubredditTop = (since, until, limit) => {
  return findSubredditTop(since, until, limit);
}

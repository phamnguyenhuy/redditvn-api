const { ServerError } = require('../helpers/server');
const moment = require('moment');
const { subreddit } = require('../services');
const { findSubreddits, findSubredditTop } = subreddit;

async function getSubreddits(since, until) {
  return {
    docs: (await findSubreddits(since, until)).map(r => r._id),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
}

async function getSubredditTop(since, until, limit) {
  return {
    docs: await findSubredditTop(since, until, limit),
    since: moment(since).unix(),
    until: moment(until).unix(),
    limit: limit
  };
}

module.exports = {
  getSubreddits,
  getSubredditTop
};

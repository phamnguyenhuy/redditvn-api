const { ServerError } = require('../helpers/server');
const { subreddit } = require('../services');
const { findSubreddits, findSubredditTop } = subreddit;

module.exports.getSubreddits = async () => {
  return await findSubreddits().map(r => r._id);
};

module.exports.getSubredditTop = async (since, until, limit) => {
  return {
    docs: await findSubredditTop(since, until, limit),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
};

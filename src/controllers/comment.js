const { ServerError } = require('../helpers/server');
const { comment } = require('../services');

const { findCommentsByPostId, findCommentsByPostIdOld, findCommentsCount } = comment;

module.exports.getCommentsCount = async (since, until) => {
  return {
    count: await findCommentsCount(since, until),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
};

module.exports.getCommentsByPostId = async (post_id, since, until, page, limit) => {
  return {
    ...(await findCommentsByPostId(post_id, since, limit, page, limit)),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
};

module.exports.getCommentsByPostIdOld = post_id => {
  return findCommentsByPostIdOld(post_id);
};

const { ServerError } = require('../helpers/server');
const { comment } = require('../services');

const { findCommentsByPostId, findCommentsByPostIdOld, findCommentsCount } = comment;

module.exports.getCommentsCount = (since, until) => {
  return findCommentsCount(since, until);
}

module.exports.getCommentsByPostId = (post_id, page, limit) => {
  return findCommentsByPostId(post_id, page, limit);
}

module.exports.getCommentsByPostIdOld = (post_id) => {
  return findCommentsByPostIdOld(post_id);
}

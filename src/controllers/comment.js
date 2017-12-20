const { ServerError } = require('../helpers/server');
const moment = require('moment');
const { comment } = require('../services');
const { findCommentsByPostId, findCommentsByPostIdOld, findCommentsCount } = comment;

async function getCommentsCount(since, until) {
  return {
    count: await findCommentsCount(since, until),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
}

async function getCommentsByPostId(post_id, since, until, page, limit) {
  return {
    ...(await findCommentsByPostId(post_id, since, until, page, limit)),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
}

function getCommentsByPostIdOld(post_id) {
  return findCommentsByPostIdOld(post_id);
}

module.exports = {
  getCommentsCount,
  getCommentsByPostId,
  getCommentsByPostIdOld
};

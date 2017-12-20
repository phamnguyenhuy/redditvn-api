const { ServerError } = require('../helpers/server');
const { post } = require('../services');
const moment = require('moment');
const {
  findNextPost,
  findPostById,
  findPostByRandom,
  findPostsBySearch,
  findPostsBySubreddit,
  findPostsByUserId,
  findPostsCount,
  findPostsOrderByComments,
  findPostsOrderByLikes,
  findPreviousPost,
  findPosts
} = post;

async function getPostsCount(since, until) {
  return {
    count: await findPostsCount(since, until),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
}

async function getPostsOrderByLikes(since, until, limit) {
  return {
    docs: await findPostsOrderByLikes(since, until, limit),
    since: moment(since).unix(),
    until: moment(until).unix(),
    limit: limit
  };
}

async function getPostsOrderByComments(since, until, limit) {
  return {
    docs: await findPostsOrderByComments(since, until, limit),
    since: moment(since).unix(),
    until: moment(until).unix(),
    limit: limit
  };
}

async function getPostById(post_id) {
  const post = await findPostById(post_id);
  if (!post) {
    throw new ServerError('Not found post.', 404);
  }

  const prev = await findPreviousPost(post.created_time);
  const next = await findNextPost(post.created_time);

  return {
    ...post,
    prev_post: prev,
    next_post: next
  };
}

function getPostByRandom(r, q) {
  return findPostByRandom(r, q);
}

async function getPostsBySearch(r, q, since, until, page, limit) {
  return {
    ...(await findPostsBySearch(r, q, since, until, page, limit)),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
}

async function getPostsBySubreddit(r, since, until, page, limit) {
  return {
    ...(await findPostsBySubreddit(r, since, until, page, limit)),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
}

function getPostsByUserId(user_id, page, limit) {
  return findPostsByUserId(user_id, page, limit);
}

async function getPosts(since, until, page, limit) {
  return {
    ...(await findPosts(since, until, page, limit)),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
}

module.exports = {
  getPostsCount,
  getPostsOrderByLikes,
  getPostsOrderByComments,
  getPostById,
  getPostByRandom,
  getPostsBySearch,
  getPostsBySubreddit,
  getPostsByUserId,
  getPosts
};

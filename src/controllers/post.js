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
  findPreviousPost
} = post;

module.exports.getPostsCount = (since, until) => {
  return findPostsCount(since, until);
};

module.exports.getPostsOrderByLikes = (since, until, limit) => {
  return findPostsOrderByLikes(since, until, limit);
};

module.exports.getPostsOrderByComments = (since, until, limit) => {
  return findPostsOrderByComments(since, until, limit);
};

module.exports.getPostById = async post_id => {
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
};

module.exports.getPostByRandom = (r, q) => {
  return findPostByRandom(r, q);
};

module.exports.getPostsBySearch = (r, q, since, until) => {
  return findPostsBySearch(r, q, since, until);
};

module.exports.getPostsBySubreddit = (r, page, limit) => {
  return findPostsBySubreddit(r, page, limit);
};

module.exports.getPostsByUserId = (user_id, page, limit) => {
  return findPostsByUserId(user_id, page, limit);
};

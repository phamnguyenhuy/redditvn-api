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

module.exports.getPostsCount = async (since, until) => {
  return {
    count: await findPostsCount(since, until),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
};

module.exports.getPostsOrderByLikes = async (since, until, limit) => {
  return {
    docs: await findPostsOrderByLikes(since, until, limit),
    since: moment(since).unix(),
    until: moment(until).unix(),
    limit: limit
  };
};

module.exports.getPostsOrderByComments = async (since, until, limit) => {
  return {
    docs: await findPostsOrderByComments(since, until, limit),
    since: moment(since).unix(),
    until: moment(until).unix(),
    limit: limit
  };
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

module.exports.getPostsBySearch = async (r, q, since, until, page, limit) => {
  return {
    ...(await findPostsBySearch(r, q, since, until, page, limit)),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
};

module.exports.getPostsBySubreddit = async (r, since, until, page, limit) => {
  return {
    ...(await findPostsBySubreddit(r, since, until, page, limit)),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
};

module.exports.getPostsByUserId = (user_id, page, limit) => {
  return findPostsByUserId(user_id, page, limit);
};

module.exports.getPosts = async (since, until, page, limit) => {
  return {
    ...(await findPosts(since, until, page, limit)),
    since: moment(since).unix(),
    until: moment(until).unix()
  };
}

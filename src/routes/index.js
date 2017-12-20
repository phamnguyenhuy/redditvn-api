const express = require('express');

const log = require('../helpers/log');
const { ServerError } = require('../helpers/server');
const controllers = require('../controllers');

const { checkDbConnection, checkPageLimit, checkSinceUntil } = require('../middlewares');

const router = express.Router();
const { auth, comment, attachment, info, me, post, stats, subreddit, user } = controllers;
const passport = require('passport');

/**
 * Handles controller execution and responds to user (API version).
 * This way controllers are not attached to the API.
 * Web socket has a similar handler implementation.
 * @param promise Controller Promise.
 * @param params (req) => [params, ...].
 */
const controllerHandler = (promise, params) => async (req, res, next) => {
  const boundParams = params ? params(req, res, next) : [];
  try {
    const result = await promise(...boundParams);
    if (!res._headerSent) return res.json(result || { message: 'OK' });
  } catch (error) {
    return res.status(500) && next(error);
  }
};
const c = controllerHandler;

const authenticate = (req, res, next) =>
  passport.authenticate(
    'jwt',
    { session: false }
    // (error, user, info, status) => {}
  )(req, res, next);
const a = authenticate;

router.use(checkDbConnection);
router.use(checkPageLimit);
router.use(checkSinceUntil);

router.post('/authorize/facebook', c(auth.postAuthorizeFacebook, (req, res, next) => [req.body.user_id, req.body.access_token]));
router.get('/authorize/refresh', a, c(auth.getRefreshToken, (req, res, next) => [req.user]));

router.get('/posts/count', c(post.getPostsCount, (req, res, next) => [req.query.since, req.query.until]));
router.get('/posts/count/comments', c(comment.getCommentsCount, (req, res, next) => [req.query.since, req.query.until]));
router.get('/posts/top/likes', c(post.getPostsOrderByLikes, (req, res, next) => [req.query.since, req.query.until, req.query.limit]));
router.get('/posts/top/comments', c(post.getPostsOrderByComments, (req, res, next) => [req.query.since, req.query.until, req.query.limit]));

router.get('/posts/:post_id/attachments', c(attachment.getAttachmentsByPostId, (req, res, next) => [req.params.post_id]));
router.get('/posts/:post_id/comments', c(comment.getCommentsByPostId, (req, res, next) => [req.params.post_id, req.query.since, req.query.until, req.query.page, req.query.limit]));
router.get('/posts/:post_id/comments-merge', c(comment.getCommentsByPostIdOld, (req, res, next) => [req.params.post_id]));
router.get('/posts/:post_id', c(post.getPostById, (req, res, next) => [req.params.post_id]));

router.get('/posts', c(post.getPosts, (req, res, next) => [req.query.since, req.query.until, req.query.page, req.query.limit]));
router.get('/random', c(post.getPostByRandom, (req, res, next) => [req.query.r, req.query.q]));
router.get('/search', c(post.getPostsBySearch, (req, res, next) => [req.query.r, req.query.q, req.query.since, req.query.until, req.query.page, req.query.limit]));

router.get('/r/top', c(subreddit.getSubredditTop, (req, res, next) => [req.query.since, req.query.until, req.query.limit]));
router.get('/r/:subreddit', c(post.getPostsBySubreddit, (req, res, next) => [req.params.subreddit, req.query.since, req.query.until, req.query.page, req.query.limit]));
router.get('/r', c(subreddit.getSubreddits, (req, res, next) => [req.query.since, req.query.until]));

router.get('/users/me/saves', a, c(me.getSaves, (req, res, next) => [req.user._id, req.query.category]));
router.post('/users/me/saves', a, c(me.postSave, (req, res, next) => [req.user._id, req.body.category, req.body.item]));
router.delete('/users/me/saves', a, c(me.deleteSave, (req, res, next) => [req.user._id, req.body.category, req.body.item]));

router.get('/users/me/picture', a, c(user.getUserPicture, (req, res, next) => [req.user._id, req.query.size, res]));
router.get('/users/me/posts', a, c(post.getPostsByUserId, (req, res, next) => [req.user._id, req.query.page, req.query.limit]));
router.get('/users/me', a, c(user.getUserById, (req, res, next) => [req.user._id]));

router.get('/users/top', c(user.getUsersTop, (req, res, next) => [req.query.since, req.query.until, req.query.limit]));
router.get('/users/count', c(user.getUsersCount));

router.get('/users/:user_id/picture', c(user.getUserPicture, (req, res, next) => [req.params.user_id, req.query.size, res]));
router.get('/users/:user_id/posts', c(post.getPostsByUserId, (req, res, next) => [req.params.user_id, req.query.page, req.query.limit]));
router.get('/users/:user_id', c(user.getUserById, (req, res, next) => [req.params.user_id]));

router.get('/users', c(user.getUsersList, (req, res, next) => [req.query.q, req.query.page, req.query.limit]));

router.get('/stats/chart', c(stats.getStatsChart, (req, res, next) => [req.query.type, req.query.group]));

router.get('/version', c(info.getVersion));
router.get('/last-updated', c(info.getLastUpdated));

// Catch 404 and forward to error handler
router.use((req, res, next) => {
  next(new ServerError('the page you requested does not exist', 404));
});

/**
 * Error-handler.
 */
router.use((err, req, res, _next) => {
  // Expected errors always throw ServerError.
  // Unexpected errors will either throw unexpected stuff or crash the application.
  if (Object.prototype.isPrototypeOf.call(ServerError.prototype, err)) {
    return res.status(err.code || 500).json({
      error: {
        message: err.message,
        type: 'ServerError',
        code: err.code
      }
    });
  }

  log.error('~~~ Unexpected error exception start ~~~');
  log.error(req);
  log.error(err);
  log.error('~~~ Unexpected error exception end ~~~');

  return res.status(500).json({
    error: {
      message: err.message || 'something when wrong...',
      type: err.type || 'UnexpectedException',
      code: err.code || 500
    }
  });
});

module.exports = router;

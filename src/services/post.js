const { ServerError } = require('../helpers/server');
const { Post } = require('../models');
const { makeSearchQuery } = require('../helpers/util');

function findPostsCount(since, until) {
  return Post.count({
    created_time: {
      $gte: since,
      $lt: until
    },
    is_deleted: { $ne: true }
  }).exec();
}

function findPostsLikesCount(since, until) {
  return Post.aggregate([
    {
      $match: {
        is_deleted: { $ne: true },
        created_time: { $gte: since, $lt: until }
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: '$likes_count' }
      }
    },
  ]).exec();
}

function findPostsOrderByLikes(since, until, limit) {
  return Post.find(
    {
      created_time: { $gte: since, $lt: until },
      is_deleted: { $ne: true }
    }
  )
    .sort({ likes_count: -1 })
    .limit(limit)
    .exec();
}

function findPostsOrderByComments(since, until, limit) {
  return Post.find(
    {
      created_time: { $gte: since, $lt: until },
      is_deleted: { $ne: true }
    }
  )
    .sort({ comments_count: -1 })
    .limit(limit)
    .exec();
}

function findPostById(post_id) {
  return Post.findById(
    post_id,
    {
      _id: 1,
      from: 1,
      message: 1,
      created_time: 1,
      comments_count: 1,
      likes_count: 1,
      is_deleted: 1,
      r: 1,
      u: 1
    },
    { lean: true }
  ).exec();
}

function findPostsByUserId(user_id, page, limit) {
  return Post.paginate(
    { 'user': user_id },
    {
      select: { _id: 1, from: 1, message: 1, created_time: 1, comments_count: 1, likes_count: 1, is_deleted: 1, r: 1, u: 1 },
      page: page,
      limit: limit,
      sort: { created_time: -1 }
    }
  );
}

function findPostsBySubreddit(r, since, until, page, limit) {
  if (r === undefined) r = null;
  if (r && r.toLowerCase() === '[null]') r = null;

  return Post.paginate(
    {
      created_time: { $gte: since, $lt: until },
      r: {'$regex' : `^${r}$`, '$options' : 'i'}
    },
    {
      select: {
        _id: 1,
        from: 1,
        message: 1,
        created_time: 1,
        comments_count: 1,
        likes_count: 1,
        is_deleted: 1
      },
      page: page,
      limit: limit,
      sort: { created_time: -1 }
    }
  );
}

function findNextPost(time) {
  return Post.findOne({ created_time: { $gt: time } }, { _id: 1 })
    .sort({ created_time: 1 })
    .limit(1)
    .exec();
}

function findPreviousPost(time) {
  return Post.findOne({ created_time: { $lt: time } }, { _id: 1 })
    .sort({ created_time: -1 })
    .limit(1)
    .exec();
}

async function findPostByRandom(r, q) {
  const query = makeSearchQuery(r, q);
  const count = await Post.count(query);
  const random = Math.floor(Math.random() * count);
  return Post.findOne(query)
    .skip(random)
    .exec();
}

function findPostsBySearch(r, q, since, until, page, limit) {
  const query = makeSearchQuery(r, q);
  if (since) {
    if (!query.created_time) query.created_time = {};
    query.created_time.$gte = since;
  }
  if (until) {
    if (!query.created_time) query.created_time = {};
    query.created_time.$lt = until;
  }

  return Post.paginate(query, {
    select: {
      _id: 1,
      from: 1,
      message: 1,
      created_time: 1,
      comments_count: 1,
      likes_count: 1,
      is_deleted: 1,
      r: 1,
      u: 1
    },
    page: page,
    limit: limit,
    sort: { created_time: -1 }
  });
}

function findPosts(since, until, page, limit) {
  return Post.paginate(
    {
      created_time: { $gte: since, $lt: until },
      is_deleted: { $ne: true }
    },
    {
      select: {
        _id: 1,
        from: 1,
        message: 1,
        created_time: 1,
        comments_count: 1,
        likes_count: 1,
        is_deleted: 1,
        r: 1,
        u: 1
      },
      page: page,
      limit: limit,
      sort: { created_time: -1 }
    }
  );
}

module.exports = {
  findPostsCount,
  findPostsOrderByLikes,
  findPostsOrderByComments,
  findPostById,
  findPostsByUserId,
  findPostsBySubreddit,
  findNextPost,
  findPreviousPost,
  findPostByRandom,
  findPostsBySearch,
  findPosts,
  findPostsLikesCount
};

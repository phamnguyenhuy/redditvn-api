const { ServerError } = require('../helpers/server');
const { Post } = require('../models');
const { makeSearchQuery } = require('../helpers/utils');

module.exports.findPostsCount = (since, until) => {
  return Post.count({
    created_time: {
      $gte: since,
      $lt: until
    },
    is_deleted: { $ne: true }
  }).exec();
};

module.exports.findPostsOrderByLikes = (since, until, limit) => {
  return Post.find(
    {
      created_time: { $gte: since, $lt: until },
      is_deleted: { $ne: true }
    },
    { _id: 1, likes_count: 1, from: 1 }
  )
    .sort({ likes_count: -1 })
    .limit(limit)
    .exec();
};

module.exports.findPostsOrderByComments = (since, until, limit) => {
  return Post.find(
    {
      created_time: { $gte: since, $lt: until },
      is_deleted: { $ne: true }
    },
    { _id: 1, comments_count: 1, from: 1 }
  )
    .sort({ comments_count: -1 })
    .limit(limit)
    .exec();
};

module.exports.findPostById = post_id => {
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
      r: 1
    },
    { lean: true }
  ).exec();
};

module.exports.findPostsByUserId = (user_id, page, limit) => {
  return Post.paginate(
    { 'from.id': user_id },
    {
      select: { _id: 1, from: 1, message: 1, created_time: 1, comments_count: 1, likes_count: 1, is_deleted: 1, r: 1 },
      page: page,
      limit: limit,
      sort: { created_time: -1 }
    }
  );
};

module.exports.findPostsBySubreddit = (r, since, until, page, limit) => {
  if (r === undefined) r = null;
  if (r && r.toLowerCase() === '[null]') r = null;

  return Post.paginate(
    {
      created_time: { $gte: since, $lt: until },
      r: { $eq: r }
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
};

module.exports.findNextPost = time => {
  return Post.findOne({ created_time: { $gt: time } }, { _id: 1 })
    .sort({ created_time: 1 })
    .limit(1)
    .exec();
};

module.exports.findPreviousPost = time => {
  return Post.findOne({ created_time: { $lt: time } }, { _id: 1 })
    .sort({ created_time: -1 })
    .limit(1)
    .exec();
};

module.exports.findPostByRandom = async (r, q) => {
  const query = makeSearchQuery(r, q);
  const count = await Post.count(query);
  const random = Math.floor(Math.random() * count);
  return Post.findOne(query)
    .skip(random)
    .exec();
};

module.exports.findPostsBySearch = (r, q, since, until, page, limit) => {
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
      r: 1
    },
    page: page,
    limit: limit,
    sort: { created_time: -1 }
  });
};

module.exports.findPosts = (since, until, page, limit) => {
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
        is_deleted: 1
      },
      page: page,
      limit: limit,
      sort: { created_time: -1 }
    }
  );
};

const { ServerError } = require('../helpers/server');
const { Comment } = require('../models');

function findCommentsCount(since, until) {
  return Comment.count({ created_time: { $gte: since, $lt: until } }).exec();
}

function findCommentsByPostId(post_id, since, until, page, limit) {
  return Comment.paginate(
    {
      post_id: post_id,
      created_time: { $gte: since, $lt: until }
    },
    {
      select: {
        _id: 1,
        parent: 1,
        from: 1,
        created_time: 1,
        message: 1
      },
      page: page,
      limit: limit,
      sort: {
        _id: 1
      },
      lean: true
    }
  );
}

async function findCommentsByPostIdOld(post_id) {
  // get root comment
  const root_comments = await Comment.find({ post_id: post_id, parent: { $eq: null } }, { _id: 1, from: 1, created_time: 1, message: 1 }, { lean: true }).sort('created_time');

  // get reply comment
  const reply_comments = await Comment.find(
    { post_id: post_id, parent: { $ne: null } },
    {
      _id: 1,
      parent: 1,
      from: 1,
      created_time: 1,
      message: 1
    },
    { lean: true }
  ).sort('created_time');

  // merge 2 type comment
  reply_comments.forEach((value, index) => {
    const idx = root_comments.findIndex(x => x._id === value.parent.id);
    if (root_comments[idx]) {
      if (root_comments[idx].replies === undefined) {
        root_comments[idx].replies = [];
      }
      delete value.parent;
      root_comments[idx].replies.push(value);
    }
  });

  return root_comments;
}

module.exports = {
  findCommentsCount,
  findCommentsByPostId,
  findCommentsByPostIdOld
};

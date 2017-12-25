const { Comment } = require('../src/models');
const getPostComment = require('./getPostComment');
const moment = require('moment');

async function updateComments(post) {
  try {
    // get comment of post
    const comments_time = new Date();
    const since_time = moment(post.comments_time).unix();
    const comments = await getPostComment(post._id, since_time);
    await Promise.all(
      comments.map(async comment => {
        // skip comment empty or dot
        if (!comment.message || comment.message === '' || comment.message === '.' || comment.message === ',') {
          return;
        }

        // add comment to database
        const newComment = new Comment({
          _id: comment.id,
          parent: comment.parent,
          post_id: post._id,
          message: comment.message,
          user: comment.from.id,
          created_time: comment.created_time
        });
        await Comment.findByIdAndUpdate(comment.id, newComment, { upsert: true });

        // find user and inc comment count
        const user = {
          $set: {
            _id: comment.from.id,
            name: comment.from.name
          },
          $inc: { comments_count: 1 }
        };
        await User.findByIdAndUpdate(item.user, user, { upsert: true });
      })
    );

    if (comments.length > 0) console.log(`==== UPDATE COMMENTS ${post._id} +${comments.length}`);

    // return comment count and comment update time
    const result = {
      count: await Comment.count({ post_id: post._id }),
      time: comments_time
    };

    return result;
  } catch (error) {
    console.log(`==== ERROR UPDATE COMMENTS ${post._id} ${error}`);
    return {};
  }
}

module.exports = updateComments;

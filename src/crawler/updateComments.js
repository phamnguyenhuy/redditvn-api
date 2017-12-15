const getPostComment = require('./getPostComment');

module.exports = async post => {
  try {
    // get comment of post
    const comments_time = new Date();
    const comments = await getPostComment(post._id, post.comments_time);
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
          from: comment.from,
          created_time: comment.created_time
        });
        await Comment.findByIdAndUpdate(comment.id, newComment, { upsert: true });
      })
    );

    // return comment count and comment update time
    const result = {
      count: await Comment.count({ post_id: post._id }),
      time
    };

    return result;
  } catch (error) {
    console.log(`==== ERROR UPDATE COMMENTS ${post._id} ${error}`);
    return {};
  }
};

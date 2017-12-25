const { Post } = require('../src/models');
const { findSubreddit, findUserReddit } = require('../src/helpers/util');

async function updatePost(item, post, comments) {
  try {
    const updateObj = {
      updated_time: item.updated_time
    };

    if (comments.count) updateObj.comments_count = comments.count;
    if (comments.time) updateObj.comments_time = comments.time;
    if (item.likes) updateObj.likes_count = item.likes.count;

    // check edited post
    if (item.message !== post.message) {
      updateObj.message = item.message; // save new
      updateObj.$push = { edit_history: post.message };
      updateObj.r = findSubreddit(item.message);
      updateObj.u = findUserReddit(item.message);
      console.log(`==== EDIT POST ${item.id}`);
    }

    // save last time update comment
    await Post.update({ _id: post.id }, updateObj);
  } catch (error) {
    console.log(`==== ERROR UPDATE POST ${post._id} ${error}`);
  }
}

module.exports = updatePost;

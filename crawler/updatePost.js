const { Post } = require('../src/models');
const { findSubreddit, findUserReddit } = require('../src/helpers/util');

async function updatePost(item, post, comments) {
  try {
    const updateObj = {
      comments_count: comments.count,
      comments_time: comments.time,
      updated_time: item.updated_time
    };

    if (item.likes) {
      updateObj.likes_count = item.likes.count;
    }

    // check edited post
    if (item.message !== post.message) {
      updateObj.message = item.message; // save new
      updateObj.$push = { edit_history: post.message };
      updateObj.r = findSubreddit(item.message);
      updateObj.u = findUserReddit(item.message);
      console.log(`==== EDIT POST ${item.id}`);
    }

    // check new object id
    if (item.object_id !== post.object_id) {
      updateObj.object_id = item.object_id;
    }

    // save last time update comment
    await Post.update({ _id: post.id }, updateObj);
  } catch (error) {
    console.log(`==== ERROR UPDATE POST ${post._id} ${error}`);
  }
}

module.exports = updatePost;

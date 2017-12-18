const { Post } = require('../models');
const { findSubreddit } = require('../helpers/utils')

module.exports = async (item, post, comments) => {
  const updateObj = {
    likes_count: item.likes.count,
    comments_count: comments.count,
    comments_time: comments.time,
    updated_time: item.updated_time
  };

  // check edited post
  if (item.message !== post.message) {
    updateObj.message = item.message; // save new
    updateObj.$push = { edit_history: post.message };
    updateObj.r = findSubreddit(item.message);
    console.log(`==== EDIT POST ${item.id}`);
  }

  // check new object id
  if (item.object_id !== post.object_id) {
    updateObj.object_id = item.object_id;
  }

  // save last time update comment
  await Post.update({ _id: post.id }, updateObj);
};

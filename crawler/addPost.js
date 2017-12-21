const { Post, User } = require('../src/models');
const { findSubreddit, findUserReddit } = require('../src/helpers/util');

async function addPost(item) {
  try {
    const post = new Post({
      _id: item.id,
      from: item.from,
      message: item.message,
      object_id: item.object_id,
      created_time: item.created_time,
      updated_time: item.updated_time,
      r: findSubreddit(item.message),
      u: findUserReddit(item.message)
    });

    if (item.likes) {
      post.likes_count = item.likes.count;
    }

    // save new post
    await post.save();
    console.log(`==== ADD POST ${item.id}`);

    // find user and inc post count
    const user = {
      $set: {
        _id: item.from.id,
        name: item.from.name
      },
      $inc: { post_count: 1 }
    };
    await User.findByIdAndUpdate(item.from.id, user, { upsert: true });
    return post;
  } catch (error) {
    console.log(`==== ERROR ADD POST ${item.id} ${error}`);
  }
}

module.exports = addPost;

const { Post } = require('../model');
const { findSubreddit } = require('../helper/utils');

module.exports = async item => {
  const post = new Post({
    _id: item.id,
    from: item.from,
    message: item.message,
    object_id: item.object_id,
    created_time: item.created_time,
    updated_time: item.updated_time,
    likes_count: item.likes.count,
    r: findSubreddit(item.message)
  });

  try {
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
};

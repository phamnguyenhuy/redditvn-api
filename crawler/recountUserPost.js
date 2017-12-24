const { Post, User } = require('../src/models');

async function recountUserPost() {
  console.log('==== recountUserPost.');
  try {
    const aggregatorOpts = [
      { $match: { is_deleted: { $ne: true } } },
      {
        $group: { _id: '$user', count: { $sum: 1 } }
      },
      { $sort: { count: -1 } }
    ];

    const userList = await Post.aggregate(aggregatorOpts);
    await User.update({}, { $unset: { posts_count: 1 } }, { multi: true });

    await Promise.all(
      userList.map(async (item, index) => {
        let user = {
          posts_count: item.count
        };
        await User.findByIdAndUpdate(item._id, user, { upsert: true });
      })
    );
  } catch (error) {
    console.log(`==== ERROR RECOUNT USER ${error}`);
  }
}

module.exports = recountUserPost;

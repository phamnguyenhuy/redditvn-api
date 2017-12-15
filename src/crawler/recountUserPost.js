const { Post, User } = require('../model');

module.exports = async () => {
  console.log('CRON: recountUserPost.');
  try {
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $ne: true }
        }
      },
      {
        $unwind: '$from'
      },
      {
        $group: {
          _id: '$from.id',
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ];

    const userList = await Post.aggregate(aggregatorOpts);
    await User.update({}, { $unset: { post_count: 1 } }, { multi: true });

    await Promise.all(
      userList.map(async (item, index) => {
        const resp = await Post.findOne(
          {
            'from.id': item._id
          },
          'from.name',
          {
            sort: {
              created_time: -1
            }
          }
        );

        if (resp) {
          let user = new User({
            _id: item._id,
            name: resp.from.name,
            post_count: item.count
          });
          await User.findByIdAndUpdate(item._id, user, { upsert: true });
        }
      })
    );
  } catch (error) {
    console.log(`==== ERROR RECOUNT USER ${error}`);
  }
};

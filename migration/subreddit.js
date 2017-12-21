const mongoose = require('mongoose');
const { config } = require('dotenv');
const { Post } = require('../src/models');
const { findSubreddit } = require('../src/helpers/util')

config();

console.log('== START');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_URI, { useMongoClient: true }, async (err, res) => {
  if (err) {
    console.log('== ERROR connecting to database: ' + err);
  } else {
    console.log('== SUCCEEDED connected to database.');

    const posts = await Post.find({}, {
      _id: 1,
      message: 1
    });

    await Promise.all(posts.map(async post => {
      var subreddit = findSubreddit(post.message);
      if (subreddit) await Post.update({ _id: post._id }, { r: subreddit});
    }));

    console.log('== FINISH');
    mongoose.connection.close();
    process.exit();
  }
});

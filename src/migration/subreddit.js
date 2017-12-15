const mongoose = require('mongoose');
const { config } = require('dotenv');
const { Post } = require('../model');
const { findSubreddit } = require('../helper/utils')

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

    await Promise.all(posts.map(post => {
      var subreddit = findSubreddit(post.message);
      await Post.update({ _id: post.id }, { r: subreddit});
    }));

    console.log('== FINISH');
    mongoose.connection.close();
    process.exit();
  }
});
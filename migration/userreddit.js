const mongoose = require('mongoose');
const { config } = require('dotenv');
const { Post } = require('../src/models');
const { findUserReddit } = require('../src/helpers/util')

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
      var userReddit = findUserReddit(post.message);
      if (userReddit) await Post.update({ _id: post._id }, { u: userReddit});
    }));

    console.log('== FINISH');
    mongoose.connection.close();
    process.exit();
  }
});

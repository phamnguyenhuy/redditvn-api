const mongoose = require('mongoose');
const { config } = require('dotenv');
const { Post } = require('../model');
const { findSubreddit } = require('../helper/utils');

config();

console.log('== START');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_URI, { useMongoClient: true }, async (err, res) => {
  if (err) {
    console.log('== ERROR connecting to database: ' + err);
  } else {
    console.log('== SUCCEEDED connected to database.');

    const deleted1 = await Post.remove({ message: { $eq: null } });
    console.log(deleted1);

    const deleted2 = await Post.remove({ message: { $exists: false } });
    console.log(deleted2);

    console.log('== FINISH');
    mongoose.connection.close();
    process.exit();
  }
});

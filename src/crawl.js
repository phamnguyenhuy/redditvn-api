const mongoose = require('mongoose');
const { config } = require('dotenv');
const crawler = require('./crawler');

config();
const fb = new FB.Facebook();
fb.options({ Promise: Promise });

console.log('== START');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_URI, { useMongoClient: true }, async (err, res) => {
  if (err) {
    console.log('== ERROR connecting to database: ' + err);
  } else {
    console.log('== SUCCEEDED connected to database.');
    await crawler();
    console.log('== FINISH');
    mongoose.connection.close();
    process.exit();
  }
});

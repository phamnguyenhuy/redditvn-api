const mongoose = require('mongoose');
const { config } = require('dotenv');
const crawler = require('./crawler');
const moment = require('moment');

config();

console.log('== START');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_URI, { useMongoClient: true }, async (err, res) => {
  if (err) {
    console.log('== ERROR connecting to database: ' + err);
  } else {
    console.log('== SUCCEEDED connected to database.');

    if (process.argv[2] === '-day') {
      const reduce_day = parseInt(process.argv[3]) || 1;
      await Setting.findByIdAndUpdate('last_updated', { value: moment().add(-reduce_day, 'days').toDate() }, { upsert: true });
    }

    await crawler();
    console.log('== FINISH');
    mongoose.connection.close();
    process.exit();
  }
});

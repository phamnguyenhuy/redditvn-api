const checkDeletedPost = require('./checkDeletePost');
const getLastCrawl = require('./getLastCrawl');
const getNewsFeed = require('./getNewsFeed');

const addPost = require('./addPost');
const updateComments = require('./updateComments');
const updatePost = require('./updatePost');

const recountUserPost = require('./recountUserPost');

const { Post, Setting } = require('../models');
const moment = require('moment');

async function run() {
  try {
    if (process.argv[2] === '-day') {
      const reduce_day = parseInt(process.argv[3]) || 1;
      await Setting.findByIdAndUpdate(
        'last_updated',
        {
          value: moment()
            .add(-reduce_day, 'days')
            .toDate()
        },
        { upsert: true }
      );
    }

    // check last post if delete
    await checkDeletedPost(20);

    // get last crawl time
    const since_new = moment();
    const since = await getLastCrawl();
    console.log(`=== SINCE: ${moment.unix(since)}`);

    // get news feed of group
    const limit = parseInt(process.env.NEWSFEED_LIMIT, 10) || 100;
    const max = parseInt(process.env.NEWSFEED_MAX, 10) || 500;
    console.log(`=== LIMIT: ${limit}`);
    console.log(`=== MAX: ${max}`);
    const newsFeedData = await getNewsFeed(process.env.FACEBOOK_GROUP_ID, since, limit, max);
    console.log(`=== NEWSFEED: ${newsFeedData.length} posts`);

    // update news feed item to database
    for (const item of newsFeedData) {
      if (!item.message || item.message === '') {
        continue;
      }

      // get post from database
      let post = await Post.findById(item.id);

      // add new post
      if (!post) {
        post = await addPost(item);
      }

      // update comment and data
      if (post) {
        const comments = await updateComments(post);
        await updatePost(item, post, comments);
      }
    }

    // save new crawl time
    await Setting.findByIdAndUpdate('last_updated', { value: since_new.toDate() }, { upsert: true });

    const s = moment()
      .startOf('day')
      .add(12, 'hours');
    const u = s.add(10, 'mins');
    if (s <= moment() && moment() <= u) {
      await recountUserPost();
    }

    console.log(`=== SINCE NEW: ${since_new}`);
  } catch (error) {
    console.log(`=== ERROR ${error}`);
  }
}

module.exports = run;

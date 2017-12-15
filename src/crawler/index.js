const checkDeletedPost = require('./checkDeletePost');
const getLastCrawl = require('./getLastCrawl');
const getNewsFeed = require('./getNewsFeed');

const addPost = require('./addPost');
const updateComments = require('./updateComments');
const updatePost = require('./updatePost');

const { Setting } = require('../model');

module.exports = async () => {
  try {
    // check last post if delete
    await checkDeletedPost(20);

    // get last crawl time
    const since_new = new Date();
    const since = await getLastCrawl();
    console.log(`=== SINCE: ${since}`)

    // get news feed of group
    const newsFeedData = await getNewsFeed(process.env.FACEBOOK_GROUP_ID, since);
    console.log(`=== NEWSFEED: ${newsFeedData.length} posts`);

    // update news feed item to database
    for (const item of newsFeedData) {
      if (item.message === '') {
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
    await Setting.findByIdAndUpdate('last_updated', { value: since_new }, { upsert: true });
    console.log(`=== SINCE NEW: ${since_new}`)
  } catch (error) {
    console.log(`=== ERROR ${error}`);
  }
};

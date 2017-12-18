const { Post } = require('../models');
const FB = require('fb');

const fb = new FB.Facebook();
fb.options({ Promise: Promise });

module.exports = async numberOfPosts => {
  const lastPosts = await Post.find({})
    .sort('-updated_time')
    .limit(numberOfPosts);
  for (const item of lastPosts) {
    try {
      const fbPost = await fb.api(item._id, {
        fields: ['id'],
        access_token: process.env.FACEBOOK_ACCESS_TOKEN
      });
    } catch (error) {
      if (error.name === 'FacebookApiException') {
        const errorObj = JSON.parse(error.message);
        if (errorObj.error.code === 100 && errorObj.error.error_subcode === 33) {
          await Post.update({ _id: item._id }, { is_deleted: true });
          console.log(`==== DELETE POST ${item._id}`);
        }
      }
    }
  }
};

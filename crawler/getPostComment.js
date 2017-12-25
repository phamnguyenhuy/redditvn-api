const moment = require('moment');
const FB = require('fb');

const fb = new FB.Facebook();
fb.options({ Promise: Promise });

async function getPostComment(post_id, since, limit = 1500) {
  let data = [];

  let run = true;
  let after = undefined;

  while (run) {
    let commentResponse;
    try {
      commentResponse = await FB.api(`${post_id}/comments`, {
        fields: ['id', 'parent.fields(id)', 'message', 'from', 'created_time'],
        access_token: process.env.FACEBOOK_ACCESS_TOKEN,
        order: 'reverse_chronological',
        filter: 'stream',
        after,
        since,
        limit
      });
    } catch (error) {
      console.log(`==== ERROR GET COMMENT API ${error}`);
    }

    // check no response data
    if (run && (!commentResponse || !commentResponse.data || commentResponse.data.length === 0)) {
      run = false;
    } else {
      data = data.concat(commentResponse.data);
    }

    // check no paging
    if (run && (!commentResponse.paging || !commentResponse.paging.cursors)) {
      run = false;
    }

    if (run) {
      after = commentResponse.paging.cursors.after;
    }
  }

  return data;
}

module.exports = getPostComment;

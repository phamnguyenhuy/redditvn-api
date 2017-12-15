const url = require('url');
const FB = require('fb');

const fb = new FB.Facebook();
fb.options({ Promise: Promise });

const setting_newsfeed_limit = parseInt(process.env.NEWSFEED_LIMIT, 10) || 100;
const setting_newsfeed_max = parseInt(process.env.NEWSFEED_MAX, 10) || 300;

module.exports = async (group_id, since, limit, max) => {
  let data = [];

  let run = true;

  since = since;
  limit = limit || setting_newsfeed_limit;
  max = max || setting_newsfeed_max;

  let until = undefined;
  let icon_size = undefined;
  let __paging_token = undefined;

  while (run) {
    const fbResponse = await fb.api(`${group_id}/feed`, {
      fields: ['id', 'from', 'message', 'object_id', 'created_time', 'updated_time', 'likes'],
      access_token: process.env.FACEBOOK_ACCESS_TOKEN,
      limit,
      since,
      until,
      icon_size,
      __paging_token
    });

    // check no response data
    if (run && (!fbResponse || !fbResponse.data || fbResponse.data.length === 0)) {
      run = false;
      console.log(`==== stop loop when no response data`);
    } else {
      // concat response data
      data = data.concat(fbResponse.data);
    }

    // check over max feed
    if (run && data.length > max) {
      run = false;
      console.log(`==== stop loop when over max`);
    }

    // check no paging
    if (run && (!fbResponse.paging || !fbResponse.paging.next)) {
      run = false;
      console.log(`==== stop loop when no paging`);
    }

    if (run) {
      const urlstring = fbResponse.paging.next;
      const queryData = url.parse(urlstring, true).query;
      icon_size = queryData.icon_size;
      limit = queryData.limit;
      until = queryData.until;
      since = queryData.since;
      __paging_token = queryData.__paging_token;
    }
  }

  return data;
};

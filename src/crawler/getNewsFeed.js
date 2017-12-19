const url = require('url');
const FB = require('fb');

const fb = new FB.Facebook();
fb.options({ Promise: Promise });

module.exports = async (group_id, since, limit = 100, max = 500) => {
  let data = [];

  let run = true;

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
